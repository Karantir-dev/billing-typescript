import React from 'react'
import s from './SupportTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import dayjs from 'dayjs'
import { Chats } from '../../../images'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

export default function Component(props) {
  const { id, theme, date, status, unread } = props
  const { t } = useTranslation(['support', 'other'])
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
    <div className={s.item}>
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
      <span className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('status', { ns: 'other' })}:</div>}
        <span className={cn(s.item_text, s.fourth_item)}>{t(status)}</span>
      </span>
      <div className={s.tableBlockFifth}>
        {mobile && <div className={s.line} />}
        <span className={cn(s.item_text, s.fifth_item)}>
          <button className={s.chatBtn}>
            <Chats className={cn({ [s.unread]: unread })} />
          </button>
        </span>
      </div>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
}
