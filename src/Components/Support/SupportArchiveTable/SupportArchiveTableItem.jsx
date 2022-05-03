import React from 'react'
import s from './SupportArchiveTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import * as route from '../../../routes'

export default function Component(props) {
  const { id, theme, date, setSelctedTicket, selected } = props
  const { t } = useTranslation(['support', 'other'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const datetimeSeparate = string => {
    let date = dayjs(string).format('DD MMM YYYY')
    let time = dayjs(string).format('HH:mm')
    return {
      date,
      time,
    }
  }

  return (
    <div
      data-testid="archive_item"
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onDoubleClick={() => navigate(`${route.SUPPORT}/requests_archive/${id}`)}
      onClick={() => setSelctedTicket(id)}
      className={cn(s.item, { [s.selected]: selected })}
    >
      <span className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('request_id')}:</div>}
        <span className={cn(s.item_text, s.first_item)}>{id}</span>
      </span>
      <span className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('theme', { ns: 'other' })}:</div>}
        <span className={cn(s.item_text, s.second_item)}>{theme}</span>
      </span>
      <span className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('date', { ns: 'other' })}:</div>}
        <span className={cn(s.item_text, s.third_item)}>
          {datetimeSeparate(date)?.date}{' '}
          <span className={s.item_text_time}>{datetimeSeparate(date)?.time}</span>
        </span>
      </span>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  setSelctedTicket: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  setSelctedTicket: () => null,
  selected: null,
}
