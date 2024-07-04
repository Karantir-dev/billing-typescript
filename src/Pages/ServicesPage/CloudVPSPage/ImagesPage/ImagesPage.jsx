import { Loader, ImagesList, Button, Filter } from '@components'
import s from './ImagesPage.module.scss'
import { useDispatch } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { useCallback, useState } from 'react'
import { cloudVpsOperations, cloudVpsActions } from '@src/Redux'
import { useTranslation } from 'react-i18next'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

export const CLOUD_IMAGE_CELLS = [
  { label: 'name', isSort: true, value: 'image_name' },
  { label: 'type', isSort: true, value: 'image_type' },
  { label: 'disk_format', isSort: true, value: 'disk_format' },
  { label: 'region', isSort: true, value: 'region' },
  { label: 'created_at', isSort: true, value: 'createdate' },
  { label: 'size', isSort: true, value: 'image_size' },
  { label: 'os', isSort: true, value: 'os_distro' },
  { label: 'price_per_day', isSort: false, value: 'cost' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

const FILTER_FIELDS = [
  { label: 'image_name', value: 'name' },
  { label: 'ID', value: 'id' },
  { label: 'status', value: 'fleio_status' },
  { label: 'os_distro', value: 'os_distro' },
  { label: 'type', value: 'image_type' },
  { label: 'region', value: 'region' },
  { label: 'disk_format', value: 'disk_format' },
]

export default function ImagesPage() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [data, setData] = useState()
  const [pagination, setPagination] = useState({})
  const [dailyCosts, setDailyCosts] = useState(0)
  const { t } = useTranslation(['cloud_vps'])
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [isFilterSet, setIsFilterSet] = useState(false)

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
            func: 'image',
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

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    navigate(`${route.CLOUD_VPS}/images/${item.id.$}`)
  }

  const setFiltersHandler = (values, render) => {
    dispatch(
      cloudVpsOperations.setImageFilter({
        func: 'image',
        values,
        signal,
        setIsLoading,
        successCallback: render === 'first' ? () => setIsFilterSet(true) : getItems,
      }),
    )
  }

  return (
    <div className={s.images}>
      <div className={s.create_wrapper}>
        <Button
          label={t('create_image')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                images_edit: 'create',
              }),
            )
          }}
        />
        <Filter
          fields={FILTER_FIELDS}
          filters={filters}
          setFiltersHandler={setFiltersHandler}
          itemsCount={data?.length}
        />
      </div>

      {isFilterSet && (
        <ImagesList
          cells={CLOUD_IMAGE_CELLS}
          items={data}
          pagination={pagination}
          getItems={getItems}
          editImage={editImage}
          cost={dailyCosts}
          pageList="images"
          itemOnClickHandler={itemOnClickHandler}
        />
      )}

      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={getItems}
        editImage={editImage}
        dailyCosts={dailyCosts}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
