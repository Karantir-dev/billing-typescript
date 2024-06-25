import { useTranslation } from 'react-i18next'
import s from './InstanceBackupSchedules.module.scss'
import { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader, EditCell } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'

const INSTANCE_BACKUPS_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'size', isSort: false, value: 'image_size' },
  { label: 'created_at', isSort: false, value: 'createdate' },
  { label: 'price_per_day', isSort: false, value: 'cost' },
  { label: 'os', isSort: false, value: 'os_distro' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

export default function InstanceBackupSchedules() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item, fetchItemById } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [dailyCosts, setDailyCosts] = useState({})
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
            func: 'instances.fleio_bckps',
            elid,
            setData,
            setCount,
            setBackupRotation,
            setDailyCosts,
            signal,
            setIsLoading,
          }),
        )
      }
    })(),
    [],
  )

  const editImage = ({ id, name, ...values }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        successCallback: getItems,
        elid: id,
        signal,
        setIsLoading,
        values: {
          image_name: name,
          plid: elid,
          ...values,
          clicked_button: 'ok',
          sok: 'ok',
        },
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
                  ...dailyCosts,
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

        <ImagesList
          cells={INSTANCE_BACKUPS_CELLS}
          items={data}
          itemsCount={count}
          getItems={getItems}
          editImage={editImage}
          cost={dailyCosts}
          pageList="backups"
        />
      </div>

      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={getItems}
        fetchInstanceData={fetchItemById}
      />

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
