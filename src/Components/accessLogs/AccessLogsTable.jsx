import React from 'react'
import s from './AccessLogsComponents.module.scss'
import { useTranslation } from 'react-i18next'
import AccessLogsTableItem from './AccessLogsTableItem'
import PropTypes from 'prop-types'

export default function Component(props) {
  const { t } = useTranslation(['access_log', 'other'])
  const { list } = props

  return (
    <div>
      <div className={s.tableHeader}>
        <span className={s.item_text}>{t('time', { ns: 'other' })}:</span>
        <span className={s.item_text}>{t('user', { ns: 'other' })}:</span>
        <span className={s.item_text}>{t('remote_ip_address')}:</span>
      </div>
      {list?.map(({ time, user, ip, id }) => (
        <AccessLogsTableItem key={id?.$} ip={ip?.$} time={time?.$} user={user?.$} />
      ))}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
