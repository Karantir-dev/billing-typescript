/* eslint-disable no-unused-vars */
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { CopyText, Loader } from '@components'
import { getFlagFromCountryName, useCancelRequest, formatCountryName } from '@utils'

import s from './InstanceDetailsOverview.module.scss'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

export default function InstanceMetrics() {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const { id: elid } = useParams()
  const [data, setData] = useState([])
  const { item } = useCloudInstanceItemContext()

  useEffect(() => {
    console.log(item, ' item')
    dispatch(cloudVpsOperations.getMetrics({ elid, setData, signal, setIsLoading }))
  }, [])

  return (
    <>
      <div className={s.content}>{JSON.stringify(data)}</div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
