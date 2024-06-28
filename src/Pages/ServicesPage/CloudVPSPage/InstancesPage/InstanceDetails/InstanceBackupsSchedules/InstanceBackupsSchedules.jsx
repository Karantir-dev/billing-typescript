import { useTranslation } from 'react-i18next'
import s from './InstanceBackupsSchedules.module.scss'
import { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader, EditCell } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'

const INSTANCE_BACKUPS_SCHEDULES_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'rotation_days', isSort: false, value: 'rotation_days' },
  { label: 'rotation_time', isSort: false, value: 'rotation_time' },
  { label: 'created_at', isSort: false, value: 'create_date' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

export default function InstanceBackupsSchedules() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item, fetchItemById } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [count, setCount] = useState(0)
  const [backupRotation, setBackupRotation] = useState()
  const [rotationFieldError, setRotationFieldError] = useState('')

  const elid = item?.id?.$

  const getItems = useCallback(
    (() => {
      let col, num, cnt
      return ({ p_col, p_num, p_cnt } = {}) => {
        col = p_col ?? col
        num = p_num ?? num
        cnt = p_cnt ?? cnt
        dispatch(
          cloudVpsOperations.getImages({
            p_col: col,
            p_num: num,
            p_cnt: cnt,
            func: 'instances.fleio_bckps.schedule',
            elid,
            setData,
            setCount,
            setBackupRotation,
            signal,
            setIsLoading,
          }),
        )
      }
    })(),
    [],
  )

  const editImage = ({ id, successCallback, name, ...values }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps.schedule',
        successCallback: () => {
          getItems()
          successCallback?.()
        },
        elid: id,

        signal,
        setIsLoading,
        values: { name, plid: elid, ...values, clicked_button: 'ok', sok: 'ok' },
      }),
    )
  }

  const editInstanceHandler = values => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        successCallback: () => setBackupRotation(values.backup_rotation),
        successToast: t('backups.backup_rotation_changed'),
        signal,
        setIsLoading,
      }),
    )
  }

  useEffect(() => {
    if (rotationFieldError) {
      const timer = setTimeout(() => {
        setRotationFieldError('')
      }, 10000) // 10 sec

      return () => clearTimeout(timer)
    }
  }, [rotationFieldError])

  const cells = INSTANCE_BACKUPS_SCHEDULES_CELLS.map(cell => {
    let renderData
    switch (cell.label) {
      case 'rotation_days':
        renderData = function renderData(value) {
          const renderValue = value
            .trim()
            .split(' ')
            .map(el => t(el.toLowerCase()))
            .join(', ')
          return <>{renderValue}</>
        }
        return { ...cell, renderData }

      default:
        return cell
    }
  })

  // useEffect(() => {
  //   console.log('Instance Item should be: ', item)
  //   const newData = data?.map(dataEl => {
  //     return { ...dataEl, servername: item?.servername, plid: item?.id }
  //   })
  //   console.log('newData: ', newData)
  //   setData(newData)
  // items={data?.map(item => {
  //   return { ...item, plid: elid }
  // })}
  // }, [item])

  return (
    <>
      <div className={s.container}>
        <Button
          label={t('create_backup_schedule')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                backup_schedule_create: {
                  ...item,
                },
              }),
            )
          }}
        />

        <div className={s.backup_rotation_wrapper}>
          <p>{t('backups.backup_rotation')}:</p>
          <div className={s.rotation_edit__field_wrapper}>
            <EditCell
              originName={backupRotation}
              className={s.backup_rotation_select}
              onSubmit={value => {
                const numValue = Number(value)
                if (numValue > 0 && numValue < 11) {
                  editInstanceHandler({ backup_rotation: value })
                } else {
                  setRotationFieldError('backups.value_in_a_range')
                }
              }}
              placeholder={backupRotation}
              isShadow={true}
            />
            {rotationFieldError && (
              <p className={s.rotation_error}>{t(rotationFieldError)}</p>
            )}
          </div>
          <p className={s.rotation_info}>{t('backups.rotation_info')}</p>
        </div>

        {console.log('data: ', data)}
        <ImagesList
          cells={cells}
          items={data}
          itemsCount={count}
          getItems={getItems}
          editImage={editImage}
          pageList="backups-schedules"
        />
      </div>

      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={getItems}
        editImage={editImage}
        fetchInstanceData={fetchItemById}
      />

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
