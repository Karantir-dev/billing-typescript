import React from 'react'
import './Calendar.scss'
import Calendar from 'react-calendar'
import cn from 'classnames'
import { CalendarArrowDouble, CalendarArrow } from '../../../images'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const dateFormat = 'YYYY-MM-DD'

export default function Component(props) {
  const { range, setStartDate, setEndDate, value, pointerClassName } = props
  const { i18n } = useTranslation()

  const changeDatehandle = value => {
    if (range) {
      setStartDate(dayjs(value[0]).format(dateFormat))
      setEndDate(dayjs(value[1]).format(dateFormat))
      return
    }
    setStartDate(dayjs(value).format(dateFormat))
    setEndDate('')
  }

  return (
    <div className="calendar_block">
      <div className={cn('calendar_pointer-wrapper', pointerClassName)}>
        <div className="calendar_pointer"></div>
      </div>
      <Calendar
        nextLabel={<CalendarArrow className="calendar__arrow" />}
        next2Label={<CalendarArrowDouble className="calendar__arrow" />}
        prevLabel={<CalendarArrow className="calendar__arrow left" />}
        prev2Label={<CalendarArrowDouble className="calendar__arrow left" />}
        view={'month'}
        formatShortWeekday={(locale, date) => {
          return dayjs(date).format('dd')
        }}
        locale={i18n.language}
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
