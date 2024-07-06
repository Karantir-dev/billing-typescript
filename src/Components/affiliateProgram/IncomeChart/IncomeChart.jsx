import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { selectors } from '@redux'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function IncomeChart({ incomeData }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  ChartJS.defaults.borderColor = darkTheme ? '#4D4855' : 'rgba(0,0,0,0.1)'
  let labels = []
  let data = []
  if (incomeData.length > 1) {
    labels = incomeData.map(({ date }) => date)
    data = incomeData.map(({ amount }) => Number(amount.replace(' EUR', '')))
  }
  return (
    <Line
      datasetIdKey="id"
      options={{
        responsive: true,
        plugins: {
          tooltip: {
            displayColors: false,
            bodyColor: darkTheme ? '#fff' : '#392955',
            titleColor: darkTheme ? '#fff' : '#392955',
            backgroundColor: darkTheme ? '#3B3447' : '#E8E0F5',
          },
          legend: {
            display: false,
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            id: 1,
            label: '',
            data,
            borderColor: '#ff50bf',
            backgroundColor: 'pink',
            borderWidth: 2,
            tension: 0.1,
          },
        ],
      }}
    />
  )
}
