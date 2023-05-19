import React from 'react'
import s from './SharedHostingHistoryModal.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { historyTranslateFn } from '../../../../utils'

export default function Component(props) {
  const { changedate, desc, ip, user } = props
  const { t } = useTranslation(['domains', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })

  return (
    <div className={s.item}>
      <div className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Date of change')}:</div>}
        <div className={cn(s.item_text, s.first_item)}>{changedate}</div>
      </div>
      <div className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('Change')}:</div>}
        <div className={cn(s.item_text, s.second_item)}>{historyTranslateFn(desc, t)}</div>
      </div>
      <div className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('Username')}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{t(user)}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('IP address')}:</div>}
        <div className={cn(s.item_text, s.fourth_item)}>{ip}</div>
      </div>
    </div>
  )
}
Component.propTypes = {
  changedate: PropTypes.string,
  desc: PropTypes.string,
  ip: PropTypes.string,
  user: PropTypes.string,
}

Component.defaultProps = {
  changedate: '',
  desc: '',
  ip: '',
  user: '',
}
