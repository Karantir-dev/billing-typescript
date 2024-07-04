import { useTranslation } from 'react-i18next'
import s from './InstanceBackupsSchedules.module.scss'
import { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { getInstanceMainInfo, useCancelRequest } from '@utils'
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
  const { isErrorStatus } = getInstanceMainInfo(item)

  const [data, setData] = useState()
  const [backupRotation, setBackupRotation] = useState()
  const [rotationFieldError, setRotationFieldError] = useState('')

  const [pagination, setPagination] = useState({})

  const elid = item?.id?.$

  const getItems = useCallback(
    (() => {
      let num
      return ({ p_col, p_num, p_cnt } = {}) => {
        num = p_num ?? num
        dispatch(
          cloudVpsOperations.getImages({
            p_col,
            p_num: num,
            p_cnt,
            func: 'instances.fleio_bckps.schedule',
            elid,
            setData,
            setBackupRotation,
            setPagination,
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
        successToast: t('backup.backup_rotation_changed'),
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

  const handleEditChange = value => {
    const isNumber = /^[0-9]+$/.test(value)

    setRotationFieldError('')
    if (!isNumber && !value === '') {
      setRotationFieldError('backup.invalid_number')
      return false
    }

    return true
  }

  const handleEditSubmit = value => {
    const numValue = Number(value)
    if (numValue > 0 && numValue < 11) {
      editInstanceHandler({ backup_rotation: value })
    } else if (numValue > 10) {
      editInstanceHandler({ backup_rotation: '10' })
    } else {
      setRotationFieldError('backup.value_in_a_range')
    }
  }

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
          disabled={isErrorStatus}
        />

        <div className={s.backup_rotation_wrapper}>
          <p className={s.rotation_label}>{t('backup.backup_rotation')}:</p>
          <div className={s.rotation_edit__field_wrapper}>
            <EditCell
              originName={backupRotation}
              className={s.backup_rotation_select}
              initBtnClassName={s.backup_rotation_btn}
              onSubmit={handleEditSubmit}
              validateOnChange={handleEditChange}
              placeholder={backupRotation}
              isShadow={true}
            />
            {rotationFieldError && (
              <p className={s.rotation_error}>{t(rotationFieldError)}</p>
            )}
          </div>
          <p className={s.rotation_info}>{t('backup.rotation_info')}</p>
        </div>

        <ImagesList
          cells={cells}
          items={data}
          pagination={pagination}
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
