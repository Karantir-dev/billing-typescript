import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { historyTranslateFn } from '../../../../../utils'

import s from './HistoryListItem.module.scss'

export default function HistoryListItem({ history }) {
  const { t } = useTranslation(['vds', 'other', 'dedicated_servers'])

  return (
    <li className={s.item}>
      <button className={cn(s.item_btn)} type="button">
        <span className={s.value}>
          <span className={s.date_wrapper}>
            {history?.changedate?.$?.split(' ')[0]}
            <span className={s.time}> {history?.changedate?.$?.split(' ')[1]}</span>
          </span>
        </span>
        <span className={s.value}>{historyTranslateFn(history?.desc?.$, t)}</span>
        <span className={s.value}>
          {history?.user?.$.replace(String.fromCharCode(39), '') ===
          'Providers employee or system'
            ? t('Provider employee or system', { ns: 'dedicated_servers' })
            : history?.user?.$}
        </span>
        <span
          className={cn({ [s.value]: true, [s.empty]: history?.ip?.$.trim() === '-' })}
        >
          {history?.ip?.$.trim() === '-'
            ? t('Not provided', { ns: 'dedicated_servers' })
            : history?.ip?.$}
        </span>
      </button>
    </li>
  )
}

HistoryListItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
