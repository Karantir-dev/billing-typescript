/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from 'react'
import { SshList, Button, Loader, Pagination, ImagesList } from '@components'
import s from './ImagesPage.module.scss'
import { CLOUD_IMAGE_CELLS } from '@utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { useCancelRequest } from '@src/utils'
import { Modals } from '@components/Services/Instances/Modals/Modals'
import { useTranslation } from 'react-i18next'

const items = [
  {
    id: 1,
    name: 'name',
    type: ' name',
    region: 'netherlands',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
  {
    id: 2,
    name: 'type',
    type: ' type 2',
    region: 'netherlands 2',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
  {
    id: 3,
    name: 'region',
    type: ' region 3',
    region: 'netherlands',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
  {
    id: 4,
    name: 'created_at',
    type: ' created_at',
    region: 'netherlands',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
  {
    id: 5,
    name: 'min_disk',
    type: ' min_disk',
    region: 'netherlands',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
  {
    id: 6,
    name: 'price_per_day',
    type: ' price_per_day',
    region: 'netherlands',
    created_at: '31.05.24',
    min_disc: '16GB',
    price_per_day: '.5$',
  },
]

export default function ImagesPage() {
  const { t } = useTranslation(['cloud_vps'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()

  return (
    <>
      <ImagesList cells={CLOUD_IMAGE_CELLS} items={items} />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
