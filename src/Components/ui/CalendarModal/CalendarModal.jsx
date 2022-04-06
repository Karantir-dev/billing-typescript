import React from 'react'
import './Calendar.scss'
import Calendar from 'react-calendar'
import { CalendarArrowRight, CalendarArrowLeft } from '../../../images'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const dateFormat = 'YYYY-MM-DD'

export default function Component(props) {
  const { range, setStartDate, setEndDate, value } = props

  const changeDatehandle = value => {
    if (range) {
      setStartDate(dayjs(value[0]).format(dateFormat))
      setEndDate(dayjs(value[1]).format(dateFormat))
      return
    }
    setStartDate(dayjs(value).format(dateFormat))
  }

  return (
    <div className="calendar_block">
      <Calendar
        nextLabel={<CalendarArrowRight />}
        next2Label={null}
        prevLabel={<CalendarArrowLeft />}
        prev2Label={null}
        view={'month'}
        formatShortWeekday={(locale, date) => {
          return dayjs(date).format('dd')
        }}
        selectRange={range}
        onChange={changeDatehandle}
        value={value ? value : null}
      />
    </div>
  )
}

Component.propTypes = {
  range: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.any]),
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
}

Component.defaultProps = {
  value: null,
  range: false,
  setStartDate: () => null,
  setEndDate: () => null,
}
