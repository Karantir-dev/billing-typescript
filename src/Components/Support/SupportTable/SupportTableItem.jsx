import React from 'react'
import s from './SupportTable.module.scss'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

export default function Component(props) {
  const { id, theme, date, status } = props
  const { t } = useTranslation(['support', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 752px)' })

  //   const datetimeSeparate = string => {
  //     const datetime = string?.split(' ')
  //     let date = datetime[0]
  //     let time = datetime[1]
  //     return {
  //       date,
  //       time,
  //     }
  //   }

  return (
    <div className={s.item}>
      {mobile && <span className={s.item_title}>{t('time', { ns: 'other' })}:</span>}
      <span style={{ flexBasis: '17.8%' }} className={s.item_text}>
        {id}
      </span>
      {mobile && <span className={s.item_title}>{t('user', { ns: 'other' })}:</span>}
      <span style={{ flexBasis: '36.5%' }} className={s.item_text}>
        {theme}
      </span>
      {mobile && <span className={s.item_title}>{t('remote_ip_address')}:</span>}
      <span style={{ flexBasis: '20.19%' }} className={s.item_text}>
        {date}
      </span>
      {mobile && <span className={s.item_title}>{t('remote_ip_address')}:</span>}
      <span style={{ flexBasis: '15.7%' }} className={s.item_text}>
        {status}
      </span>
    </div>
  )
}

Component.propTypes = {
  time: PropTypes.string,
  user: PropTypes.string,
  ip: PropTypes.string,
}

Component.defaultProps = {
  time: '',
  user: '',
  ip: '',
}
