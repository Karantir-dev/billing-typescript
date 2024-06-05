/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import {
  Loader,
  ImagesList,
  ImagesOptions,
  TooltipWrapper,
  Icon,
  EditCell,
} from '@components'
import s from './ImagesPage.module.scss'
import { CLOUD_IMAGE_CELLS } from '@utils/constants'
import { useDispatch } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { cloudVpsOperations } from '@src/Redux'

export default function ImagesPage() {
  const { t } = useTranslation(['cloud_vps', 'countries'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [images, setImages] = useState()
  const [imagesCount, setImagesCount] = useState(0)

  const getItems = params => {
    dispatch(
      cloudVpsOperations.getImages({
        ...params,
        setData: setImages,
        setCount: setImagesCount,
        signal,
        setIsLoading,
      }),
    )
  }

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="region"]') ||
      e.target.closest('[data-target="name"]') ||
      e.target.closest('[data-target="os"]')
    )
      return
    console.log(item, ' item')
  }

  return (
    <div className={s.images}>
      <ImagesList
        cells={CLOUD_IMAGE_CELLS}
        items={images}
        itemsCount={imagesCount}
        itemOnClickHandler={itemOnClickHandler}
        getItems={getItems}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
