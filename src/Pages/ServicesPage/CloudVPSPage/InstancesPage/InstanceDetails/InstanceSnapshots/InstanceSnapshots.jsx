import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader, WarningMessage, Filter } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'
import { t } from 'i18next'

const INSTANCE_SNAPSHOTS_CELLS = [
  { label: 'name', isSort: true, value: 'name' },
  { label: 'size', isSort: true, value: 'image_size' },
  { label: 'created_at', isSort: true, value: 'createdate' },
  { label: 'price_per_day', isSort: false, value: 'cost' },
  { label: 'os', isSort: true, value: 'os_distro' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

const FILTER_FIELDS = [
  { label: t('image.name.snapshot', { ns: 'cloud_vps' }), value: 'name' },
  { label: 'ID', value: 'id' },
  { label: t('Status', { ns: 'cloud_vps' }), value: 'fleio_status' },
  { label: t('image.os_distro', { ns: 'cloud_vps' }), value: 'os_distro' },
  {
    label: t('image.protected', { ns: 'cloud_vps' }),
    value: 'protected',
    type: 'checkbox',
    checkboxValues: { checked: 'on', unchecked: 'off' },
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
  const [filters, setFilters] = useState({})
  const [isFilterSet, setIsFilterSet] = useState(false)

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
            setFilters,
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

  const createdToday = dailyCosts?.created_today?.$

  const setFiltersHandler = (values, render) => {
    dispatch(
      cloudVpsOperations.setImageFilter({
        func: 'instances.snapshots',
        values,
        signal,
        setIsLoading,
        successCallback: render === 'first' ? () => setIsFilterSet(true) : getItems,
      }),
    )
  }

  return (
    <>
      <div className={s.container}>
        <p>{t('snapshots.limit_value')}</p>
        <div className={s.create_wrapper}>
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
          <Filter
            fields={FILTER_FIELDS}
            filters={filters}
            setFiltersHandler={setFiltersHandler}
            itemsCount={data?.length}
          />
        </div>
        {createdToday >= 5 && (
          <WarningMessage className={s.snapshot_limit_message}>
            {t('snapshots.limit_reached')}
          </WarningMessage>
        )}
        {isFilterSet && (
          <ImagesList
            cells={INSTANCE_SNAPSHOTS_CELLS}
            items={data}
            itemsCount={count}
            getItems={getItems}
            editImage={editImage}
            cost={dailyCosts}
            pageList="snapshots"
          />
        )}
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
