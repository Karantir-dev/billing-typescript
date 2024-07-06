import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'
import { Loader } from '@components'
import { useCancelRequest, formatBytes } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

import s from './InstanceNetworkTraffic.module.scss'

const TrafficCard = ({ title, trafficData }) => {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <div className={s.traffic_card}>
      <h3 className={s.traffic_card__title}>{t(title)}</h3>

      {trafficData?.map((data, index) => {
        const { id, startDate, endDate, incoming, outgoing, total } = data
        return (
          <div key={`${id}_${index}`} className={s.traffic_card__data_wrapper}>
            <div className={s.traffic_card__data_block}>
              <p className={s.traffic_card__row_name}>{t('start_date')}:</p>
              <p className={s.traffic_card__value}>{startDate}</p>
            </div>
            <div className={s.traffic_card__data_block}>
              <p className={s.traffic_card__row_name}>{t('end_date')}:</p>
              <p className={s.traffic_card__value}>{endDate}</p>
            </div>
            <div className={s.traffic_card__data_block}>
              <p className={s.traffic_card__row_name}>{t('incoming')}:</p>
              <p className={s.traffic_card__value}>{incoming}</p>
            </div>
            <div className={s.traffic_card__data_block}>
              <p className={s.traffic_card__row_name}>{t('outgoing')}:</p>
              <p className={s.traffic_card__value}>{outgoing}</p>
            </div>
            <div className={s.traffic_card__data_block}>
              <p className={s.traffic_card__row_name}>{t('total')}:</p>
              <p className={s.traffic_card__value}>{total}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function InstanceNetworkTraffic() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [NetworkTrafficInfo, setNetworkTrafficInfo] = useState({})

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

  const formatTrafficData = data => ({
    startDate: data?.$start_dt ? new Date(data?.$start_dt).toLocaleDateString() : '-',
    endDate: data?.$end_dt ? new Date(data?.$end_dt).toLocaleDateString() : '-',
    incoming: data?.$in ? formatBytes(Number(data?.$in)) : '-',
    outgoing: data?.$out ? formatBytes(Number(data?.$out)) : '-',
    total:
      data?.$in && data?.$in ? formatBytes(Number(data?.$in) + Number(data?.$out)) : '-',
  })

  const cycleTraffic = Array.isArray(NetworkTrafficInfo?.cycle_traffic)
    ? NetworkTrafficInfo?.cycle_traffic.map(el => formatTrafficData(el))
    : [formatTrafficData(NetworkTrafficInfo?.cycle_traffic)]

  const monthTraffic = Array.isArray(NetworkTrafficInfo?.month_traffic)
    ? NetworkTrafficInfo?.month_traffic.map(el => formatTrafficData(el))
    : [formatTrafficData(NetworkTrafficInfo?.month_traffic)]

  return (
    <>
      <div className={s.traffic_container}>
        {cycleTraffic.length > 0 && (
          <TrafficCard title="traffic_per_cycle" trafficData={cycleTraffic} />
        )}
        {monthTraffic.length > 0 && (
          <TrafficCard title="traffic_per_month" trafficData={monthTraffic} />
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
