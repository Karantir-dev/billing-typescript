import React from 'react'
import PayersTableItem from './PayersTableItem'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './PayersTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['payers', 'other'])
  const { list } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>{t('Name')}:</span>
        <span className={cn(s.title_text, s.third_item)}>{t('Payer status')}:</span>
        <span className={cn(s.title_text, s.fourth_item)} />
      </div>
      {list?.map(el => {
        const { profiletype, name, id } = el
        return (
          <PayersTableItem key={id?.$} name={name?.$} status={profiletype?.$} id={id?.$} />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
