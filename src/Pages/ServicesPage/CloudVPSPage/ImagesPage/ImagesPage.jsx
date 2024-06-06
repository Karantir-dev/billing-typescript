/* eslint-disable no-unused-vars */
import { Loader, ImagesList } from '@components'
import s from './ImagesPage.module.scss'
import { useDispatch } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { useState } from 'react'
import { cloudVpsOperations } from '@src/Redux'

export const CLOUD_IMAGE_CELLS = [
  { label: 'name', isSort: true, value: 'image_name' },
  { label: 'type', isSort: true, value: 'image_type' },
  { label: 'disk_format', isSort: true, value: 'disk_format' },
  { label: 'region', isSort: true, value: 'region' },
  { label: 'created_at', isSort: true, value: 'createdate' },
  { label: 'size', isSort: true, value: 'min_disk' },
  { label: 'os', isSort: true, value: 'os_distro' },
  { label: 'price_per_day', isSort: true, value: 'cost' },
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

  const getItems = params => {
    dispatch(
      cloudVpsOperations.getImages({
        ...params,
        func: 'image',
        setData: setImages,
        setCount: setImagesCount,
        signal,
        setIsLoading,
      }),
    )
  }

  const editName = ({ elid, value }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        successCallback: getItems,
        elid,
        signal,
        setIsLoading,
        values: { image_name: value },
      }),
    )
  }

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    console.log('open item page')
  }

  return (
    <div className={s.images}>
      <ImagesList
        cells={CLOUD_IMAGE_CELLS}
        items={images}
        itemsCount={imagesCount}
        itemOnClickHandler={itemOnClickHandler}
        getItems={getItems}
        editName={editName}
        type="images"
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
