import { useTranslation } from 'react-i18next'
import s from './InstanceBackups.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader, WarningMessage } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

const INSTANCE_BACKUPS_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'backup_type', isSort: false, value: 'backup_type' },
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

export default function InstanceBackups() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])
  const navigate = useNavigate()

  const { item, fetchItemById } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [dailyCosts, setDailyCosts] = useState({})
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
            func: 'instances.fleio_bckps',
            elid,
            setData,
            setPagination,
            setDailyCosts,
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
        func: 'image',
        successCallback: () => {
          getItems()
          successCallback?.()
        },
        elid: id,
        signal,
        setIsLoading,
        values: { image_name: name, ...values, clicked_button: 'ok', sok: 'ok' },
      }),
    )
  }

  const itemOnClickHandler = (e, item, instanceId) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    navigate(`${route.CLOUD_VPS}/${instanceId}/backups/${item.id.$}`)
  }
  const createdToday = dailyCosts?.created_today?.$

  return (
    <>
      <div className={s.container}>
        <div className={s.create_wrapper}>
          <p>{t('backups.limit_value')}</p>
          <Button
            label={t('create_backup')}
            size="large"
            isShadow
            onClick={() => {
              dispatch(
                cloudVpsActions.setItemForModals({
                  backup_create: {
                    ...item,
                    ...dailyCosts,
                  },
                }),
              )
            }}
            disabled={createdToday >= 5}
          />

          {createdToday >= 5 && (
            <WarningMessage className={s.backup_limit_message}>
              {t('snapshots.limit_reached')}
            </WarningMessage>
          )}
        </div>

        <ImagesList
          cells={INSTANCE_BACKUPS_CELLS}
          items={data}
          pagination={pagination}
          getItems={getItems}
          editImage={editImage}
          cost={dailyCosts}
          pageList="backups"
          itemOnClickHandler={itemOnClickHandler}
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
