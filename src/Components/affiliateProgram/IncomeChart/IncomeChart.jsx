import React from 'react'
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
import { selectors } from '../../../Redux'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function IncomeChart({ incomeData }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  ChartJS.defaults.borderColor = darkTheme ? '#4D4855' : '#4D4855'
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
            // bodyColor: '#ff50bf',
            // titleColor: '#ff50bf',
            backgroundColor: '#2e273b',
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
