import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import s from './InstanceMetrics.module.scss'
import { useSelector } from 'react-redux'
import { selectors } from '@redux'
import { useTranslation } from 'react-i18next'
import { formatBytes, roundToDecimal } from '@utils'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const CHARTS = {
  interface_traffic: {
    packets: ['$packets_in', '$packets_out'],
    bytes: ['$bytes_in', '$bytes_out'],
  },
  cpu_util: {
    cpu: ['$value'],
  },
}

const LINE_COLORS = ['#ff50bf', '#6749e6']
const FILL_COLORS = ['rgba(255, 80, 191, .25)', 'rgba(103, 73, 230, .25)']

const TIME_FORMAT = {
  hours: {
    hour: '2-digit',
    minute: '2-digit',
  },
  days: {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  },
}

export const Charts = ({ data, chartType, chartPeriod }) => {
  const { t } = useTranslation(['cloud_vps'])
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const [bytesUnit, setBytesUnit] = useState('')

  const getOptions = ({ chart }) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          displayColors: false,
          bodyColor: darkTheme ? '#fff' : '#392955',
          titleColor: darkTheme ? '#fff' : '#392955',
          backgroundColor: darkTheme ? '#3B3447' : '#E8E0F5',
          callbacks: {
            label: function (tooltipItem) {
              if (tooltipItem.dataset.chartType === 'interface_traffic') {
                if (tooltipItem.dataset.originLabel.includes('$packets')) {
                  console.log(tooltipItem)
                  return `${tooltipItem.dataset.label}: ${roundToDecimal(
                    tooltipItem.raw,
                  )} ${t('pcs')}`
                } else {
                  let label = tooltipItem.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  label += formatBytes(tooltipItem.raw)
                  return label
                }
              } else if (tooltipItem.dataset.chartType === 'cpu_util') {
                return `${tooltipItem.dataset.label}: ${roundToDecimal(tooltipItem.raw)}%`
              }
            },
          },
        },
        legend: {
          align: isMobile ? 'start' : 'center',
          labels: {
            color: darkTheme ? '#fff' : '#392955',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: darkTheme ? '#fff' : '#929293',
          },
          grid: {
            color: darkTheme ? 'rgba(255,255,255, .25)' : '#eeedef',
          },
        },
        y: {
          ticks: {
            color: darkTheme ? '#fff' : '#929293',
            callback: value => {
              if (chart === 'bytes') {
                return formatBytes(value, bytesUnit).replace(/\D/g, '')
              } else if (chart === 'cpu') {
                return roundToDecimal(value)
              }
              return value
            },
          },
          grid: {
            color: darkTheme ? 'rgba(255,255,255, .25)' : '#eeedef',
          },
          title: {
            display: true,
            text:
              chart === 'bytes'
                ? `${t(`metrics.scales.${chart}`)}, ${bytesUnit}`
                : t(`metrics.scales.${chart}`),

            color: darkTheme ? '#fff' : '#929293',
          },
        },
      },
    }
  }

  useEffect(() => {
    const unit = formatBytes(Math.max(...data.map(el => el.$bytes_in)))
      .replace(/[\d.]+/g, '')
      .trim()

    setBytesUnit(unit)
  }, [data])

  const timeOptions = ['uk-UA', TIME_FORMAT[chartPeriod <= 24 ? 'hours' : 'days']]

  if (!data.length) {
    return <p className={s.metrics_chart_empty}>{t('metrics_chart_empty')}</p>
  }

  return (
    <div className={s.metrics_charts}>
      {Object.keys(CHARTS[chartType]).map((chart, i) => {
        return (
          <div key={i} className={s.metrics_chart}>
            <Line
              data={{
                labels: data.map(el => new Date(el.$date).toLocaleString(...timeOptions)),
                datasets: CHARTS[chartType][chart].map((line, i) => {
                  return {
                    label: t(`metrics.${chartType}.${line}`),
                    originLabel: line,
                    chartType: chartType,
                    data: data.map(el => el[line]),
                    tension: 0.3,
                    borderColor: LINE_COLORS[i],
                    backgroundColor: FILL_COLORS[i],
                    pointRadius: 3,
                    fill: true,
                  }
                }),
              }}
              options={getOptions({ chart })}
            />
          </div>
        )
      })}
    </div>
  )
}
