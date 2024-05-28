import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'
import { Loader } from '@components'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

import s from './InstanceNetworkTraffic.module.scss'

const formatBytes = bytes => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

const TrafficCard = ({ title, startDate, endDate, incoming, outgoing, total }) => {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <div className={s.traffic_card}>
      <h3 className={s.traffic_card__title}>{t(title)}</h3>

      <div className={s.traffic_card__data_wrapper}>
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
    startDate: data.$start_dt ? new Date(data.$start_dt).toLocaleDateString() : '-',
    endDate: data.$end_dt ? new Date(data.$end_dt).toLocaleDateString() : '-',
    incoming: formatBytes(Number(data.$in)),
    outgoing: formatBytes(Number(data.$out)),
    total: formatBytes(Number(data.$in) + Number(data.$out)),
  })

  const cycleTraffic = NetworkTrafficInfo.cycle_traffic
    ? formatTrafficData(NetworkTrafficInfo.cycle_traffic)
    : null
  const monthTraffic = NetworkTrafficInfo.month_traffic
    ? formatTrafficData(NetworkTrafficInfo.month_traffic)
    : null

  return (
    <>
      <div className={s.traffic_container}>
        {cycleTraffic && (
          <TrafficCard
            title="traffic_per_cycle"
            startDate={cycleTraffic.startDate}
            endDate={cycleTraffic.endDate}
            incoming={cycleTraffic.incoming}
            outgoing={cycleTraffic.outgoing}
            total={cycleTraffic.total}
          />
        )}
        {monthTraffic && (
          <TrafficCard
            title="traffic_per_month"
            startDate={monthTraffic.startDate}
            endDate={monthTraffic.endDate}
            incoming={monthTraffic.incoming}
            outgoing={monthTraffic.outgoing}
            total={monthTraffic.total}
          />
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
