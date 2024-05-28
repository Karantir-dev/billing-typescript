import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'
import { Loader, Select } from '@components'
import { useCancelRequest } from '@utils'

import s from './InstanceMetrics.module.scss'
import { Charts } from './Charts'
import { METRICS_PERIOD_OPTIONS, METRICS_TYPE_OPTIONS } from '@utils/constants'

export default function InstanceMetrics() {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const { id: elid } = useParams()

  const [data, setData] = useState([])

  const [chartType, setChartType] = useState('interface_traffic')
  const [chartPeriod, setChartPeriod] = useState('1')

  const getMetrics = ({ period, metric } = {}) => {
    dispatch(
      cloudVpsOperations.getMetrics({
        elid,
        metric: metric ?? chartType,
        hours: period ?? chartPeriod,
        setData,
        signal,
        setIsLoading,
      }),
    )
  }

  useEffect(() => {
    getMetrics()
  }, [])

  return (
    <div className={s.content}>
      <div className={s.metrics_selects}>
        <Select
          label={t('select_metrics')}
          itemsList={METRICS_TYPE_OPTIONS.map(el => ({
            ...el,
            label: t(`metrics.type.${el.label}`),
          }))}
          value={chartType}
          getElement={metric => {
            setChartType(metric)
            getMetrics({ metric })
          }}
          isShadow
        />
        <Select
          label={t('period')}
          itemsList={METRICS_PERIOD_OPTIONS.map(el => ({
            ...el,
            label: t(`metrics.period.${el.label}`),
          }))}
          value={chartPeriod}
          getElement={period => {
            setChartPeriod(period)
            getMetrics({ period })
          }}
          isShadow
        />
      </div>
      {isLoading ? (
        <Loader local shown={isLoading} halfScreen />
      ) : (
        <Charts data={data} chartType={chartType} chartPeriod={chartPeriod} />
      )}
    </div>
  )
}
