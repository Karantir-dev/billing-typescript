import React from 'react'
import s from './SupportTable.module.scss'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export default function Component(props) {
  const { t } = useTranslation(['access_log', 'other'])
  const { list } = props
  console.log(t, list)
  return (
    <div>
      <div className={s.tableHeader}>
        <span className={s.item_text}>{'id запроса:'}:</span>
        <span className={s.item_text}>{'Тема:'}:</span>
        <span className={s.item_text}>{'Дата:'}:</span>
        <span className={s.item_text}>{'Статус:'}:</span>
      </div>
      {/* {list?.map(({ time, user, ip, id }) => (
        <AccessLogsTableItem key={id?.$} ip={ip?.$} time={time?.$} user={user?.$} />
      ))} */}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
}

Component.defaultProps = {
  list: [],
}
