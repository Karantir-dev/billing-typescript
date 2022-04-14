import React from 'react'
import SupportTableItem from './SupportTableItem'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import s from './SupportTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const { list } = props
  console.log(list)
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span style={{ flexBasis: '17.8%' }} className={s.item_text}>
          {t('request_id')}:
        </span>
        <span style={{ flexBasis: '36.5%' }} className={s.item_text}>
          {t('theme', { ns: 'other' })}:
        </span>
        <span style={{ flexBasis: '20.19%' }} className={s.item_text}>
          {t('date', { ns: 'other' })}:
        </span>
        <span style={{ flexBasis: '15.7%' }} className={s.item_text}>
          {t('status', { ns: 'other' })}:
        </span>
        <span style={{ flexBasis: '9.7%' }} className={s.item_text} />
      </div>
      {list?.map(({ tstatus, last_message, name, id }) => (
        <SupportTableItem
          key={id?.$}
          theme={name?.$}
          date={last_message?.$}
          status={tstatus?.$}
          id={id?.$}
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
