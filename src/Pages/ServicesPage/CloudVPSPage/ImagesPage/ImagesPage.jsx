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
import { t } from 'i18next'

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
  { label: t('image.name.image', { ns: 'cloud_vps' }), value: 'name' },
  { label: 'ID', value: 'id' },
  { label: t('Status', { ns: 'cloud_vps' }), value: 'fleio_status' },
  { label: t('image.os_distro', { ns: 'cloud_vps' }), value: 'os_distro' },
  { label: t('type', { ns: 'cloud_vps' }), value: 'image_type' },
  { label: t('region', { ns: 'cloud_vps' }), value: 'region' },
  { label: t('disk_format', { ns: 'cloud_vps' }), value: 'disk_format' },
]

export default function ImagesPage() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [data, setData] = useState()
  const [imagesCount, setImagesCount] = useState(0)
  const [dailyCosts, setDailyCosts] = useState(0)
  const { t } = useTranslation(['cloud_vps'])
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [isFilterSet, setIsFilterSet] = useState(false)

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
            func: 'image',
            setData,
            setCount: setImagesCount,
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
          itemsCount={imagesCount}
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
