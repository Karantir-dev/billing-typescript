import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader, WarningMessage } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'

const INSTANCE_SNAPSHOTS_CELLS = [
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

export default function InstanceSnapshots() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item, fetchItemById } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [dailyCosts, setDailyCosts] = useState({})
  const [count, setCount] = useState(0)

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
            func: 'instances.snapshots',
            elid,
            setData,
            setCount,
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
        func: 'instances.snapshots',
        successCallback: getItems,
        elid: id,
        signal,
        setIsLoading,
        values: { name, plid: elid, ...values, clicked_button: 'ok', sok: 'ok' },
      }),
    )
  }

  const createdToday = dailyCosts?.created_today?.$

  return (
    <>
      <div className={s.container}>
        <div className={s.create_wrapper}>
          <p>{t('snapshots.limit_value')}</p>
          <Button
            label={t('create_snapshot')}
            size="large"
            isShadow
            onClick={() => {
              dispatch(
                cloudVpsActions.setItemForModals({
                  snapshot_create: {
                    ...item,
                    ...dailyCosts,
                  },
                }),
              )
            }}
            disabled={createdToday >= 5}
          />
          {createdToday >= 5 && (
            <WarningMessage className={s.snapshot_limit_message}>
              {t('snapshots.limit_reached')}
            </WarningMessage>
          )}
        </div>

        <ImagesList
          cells={INSTANCE_SNAPSHOTS_CELLS}
          items={data}
          itemsCount={count}
          getItems={getItems}
          editImage={editImage}
          cost={dailyCosts}
          pageList="snapshots"
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
