/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { getInstanceMainInfo, useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import {
  Button,
  ImagesList,
  Loader,
  WarningMessage,
  Filter,
  BlockPageMessage,
} from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

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
  { label: 'snapshot_name', value: 'name' },
  { label: 'ID', value: 'id' },
  { label: 'status', value: 'fleio_status' },
  { label: 'os_distro', value: 'os_distro' },
  {
    label: 'protected',
    value: 'protected',
    type: 'checkbox',
    checkboxValues: { checked: 'on', unchecked: 'off' },
  },
]

export default function InstanceSnapshots() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])
  const navigate = useNavigate()

  const { item, fetchItemById } = useCloudInstanceItemContext()
  const { isErrorStatus, isImageUploading, displayStatus } = getInstanceMainInfo(item)

  const [data, setData] = useState()
  const [dailyCosts, setDailyCosts] = useState({})
  const [filters, setFilters] = useState({})
  const [isFilterSet, setIsFilterSet] = useState(false)
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
            func: 'instances.snapshots',
            elid,
            setData,
            setPagination,
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

  const itemOnClickHandler = (e, item, instanceId) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    navigate(`${route.CLOUD_VPS}/${instanceId}/snapshots/${item.id.$}`)
  }

  const createdToday = dailyCosts?.created_today?.$

  const setFiltersHandler = (values, render) => {
    dispatch(
      cloudVpsOperations.setImageFilter({
        func: 'instances.snapshots',
        values,
        signal,
        setIsLoading,
        successCallback:
          render === 'first' ? () => setIsFilterSet(true) : () => getItems({ p_num: 1 }),
      }),
    )
  }

  return (
    <>
      {(isErrorStatus || isImageUploading) && (
        <BlockPageMessage
          text={t('functionality_unavailable', { status: displayStatus.toUpperCase() })}
        />
      )}
      <div className={s.container}>
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
            disabled={createdToday >= 5 || isErrorStatus}
          />
          <Filter
            fields={FILTER_FIELDS}
            filters={filters}
            setFiltersHandler={setFiltersHandler}
            itemsCount={data?.length}
          />
        </div>
        <p>
          {t('snapshot.limit_value')}: {createdToday || 0} / 5
        </p>
        {createdToday >= 5 && (
          <WarningMessage className={s.snapshot_limit_message}>
            {t('snapshot.limit_reached')}
          </WarningMessage>
        )}
        {isFilterSet && (
          <ImagesList
            cells={INSTANCE_SNAPSHOTS_CELLS}
            items={data}
            pagination={pagination}
            getItems={getItems}
            editImage={editImage}
            cost={dailyCosts}
            pageList="snapshot"
            itemOnClickHandler={itemOnClickHandler}
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
