/* eslint-disable no-unused-vars */
import { Loader, ImagesList, Button } from '@components'
import s from './ImagesPage.module.scss'
import { useDispatch } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { useCallback, useState } from 'react'
import { cloudVpsOperations, cloudVpsActions } from '@src/Redux'
import { useTranslation } from 'react-i18next'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'

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

export default function ImagesPage() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [images, setImages] = useState()
  const [imagesCount, setImagesCount] = useState(0)
  const [dailyCosts, setDailyCosts] = useState(0)
  const { t } = useTranslation(['cloud_vps'])

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
            setData: setImages,
            setCount: setImagesCount,
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

  return (
    <div className={s.images}>
      <Button
        label={t('create_image')}
        size="large"
        isShadow
        onClick={() => {
          dispatch(
            cloudVpsActions.setItemForModals({
              image_edit: 'create',
            }),
          )
        }}
      />
      <ImagesList
        cells={CLOUD_IMAGE_CELLS}
        items={images}
        itemsCount={imagesCount}
        getItems={getItems}
        editImage={editImage}
        cost={dailyCosts}
        type="image"
      />

      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={getItems}
        editImage={editImage}
        dailyCosts
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
