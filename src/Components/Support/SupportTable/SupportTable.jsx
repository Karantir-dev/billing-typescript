import React from 'react'
import SupportTableItem from './SupportTableItem'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SupportTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { list } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('request_id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>
          {t('theme', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.third_item)}>
          {t('date', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fourth_item)}>
          {t('status', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.fifth_item)} />
      </div>
      {list?.map(({ tstatus, last_message, name, id, unread }) => (
        <SupportTableItem
          key={id?.$}
          theme={name?.$}
          date={last_message?.$}
          status={tstatus?.$}
          id={id?.$}
          unread={unread?.$ === 'on'}
        />
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
