import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const Clock = props => {
  const { date } = props
  const [time, setTime] = useState(dayjs(date).format('YYYY-MM-DD HH:mm:ss'))

  useEffect(() => {
    let intervalID = setInterval(() => updateClock(), 1000)
    return () => {
      clearInterval(intervalID)
    }
  })

  const updateClock = () => {
    setTime(t => dayjs(t).add(1, 's').format('YYYY-MM-DD HH:mm:ss'))
  }

  return time
}

export default Clock
