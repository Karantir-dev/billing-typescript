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
  interface_traffic: [
    ['$packets_in', '$packets_out'],
    ['$bytes_in', '$bytes_out'],
  ],
  cpu_util: [['$value']],
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
    day: '2-digit',
    month: '2-digit',
  },
}

export const Charts = ({ data, chartType, chartPeriod }) => {
  const { t } = useTranslation(['cloud_vps'])

  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        displayColors: false,
        bodyColor: darkTheme ? '#fff' : '#392955',
        titleColor: darkTheme ? '#fff' : '#392955',
        backgroundColor: darkTheme ? '#3B3447' : '#E8E0F5',
      },
    },
  }

  const timeOptions = ['en-US', TIME_FORMAT[chartPeriod <= 24 ? 'hours' : 'days']]

  if (!data.length) {
    return <p className={s.metrics_chart_empty}>{t('metrics_chart_empty')}</p>
  }

  return (
    <div className={s.metrics_charts}>
      {CHARTS[chartType].map((chart, i) => (
        <div key={i} className={s.metrics_chart}>
          <Line
            data={{
              labels: data.map(el => new Date(el.$date).toLocaleString(...timeOptions)),
              datasets: chart.map((line, i) => ({
                label: t(`metrics.${chartType}.${line}`),
                data: data.map(el => el[line]),
                tension: 0.3,
                borderColor: LINE_COLORS[i],
                backgroundColor: FILL_COLORS[i],
                pointRadius: 3,
                fill: true,
              })),
            }}
            options={lineOptions}
          />
        </div>
      ))}
    </div>
  )
}
