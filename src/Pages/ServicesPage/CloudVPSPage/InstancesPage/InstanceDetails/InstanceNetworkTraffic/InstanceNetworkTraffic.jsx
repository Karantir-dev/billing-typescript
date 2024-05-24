/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { CopyText, Loader } from '@components'
import { getFlagFromCountryName, useCancelRequest, formatCountryName } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

export default function InstanceNetworkTraffic() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [NetworkTrafficInfo, setNetworkTrafficInfo] = useState({})

  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()

  const { item } = useCloudInstanceItemContext()

  const elid = item?.id?.$

  useEffect(() => {
    elid &&
      dispatch(
        cloudVpsOperations.getInstanceNetworkTrafficInfo(
          elid,
          setNetworkTrafficInfo,
          signal,
          setIsLoading,
        ),
      )
  }, [])

  return (
    <>
      <div></div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
