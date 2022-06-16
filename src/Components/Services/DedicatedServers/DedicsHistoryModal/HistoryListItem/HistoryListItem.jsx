import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './HistoryListItem.module.scss'

export default function HistoryListItem({ history }) {
  const { t } = useTranslation(['vds', 'other', 'dedicated_servers'])

  return (
    <li className={s.item}>
      <button className={cn(s.item_btn)} type="button">
        <span className={s.value}>
          {history?.changedate?.$}
          <span className={s.price}>
            {history?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>
        <span className={s.value}>{parseTranslation(history?.desc?.$, t)}</span>
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

export function parseTranslation(str, t) {
  let translate = str
    .replace(
      'The reboot process is started',
      t('The reboot process is started', { ns: 'dedicated_servers' }),
    )
    .replace(
      'Auto-renewal period is set to',
      t('Auto-renewal period is set to', { ns: 'dedicated_servers' }),
    )
    .replace('Month', t('Month', { ns: 'dedicated_servers' }))
    .replace('Three months', t('Three months', { ns: 'Three months' }))
    .replace('Half a year', t('Half a year', { ns: 'dedicated_servers' }))
    .replace('Three years', t('Three years', { ns: 'dedicated_servers' }))
    .replace('Year', t('Year', { ns: 'dedicated_servers' }))
    .replace('Two years', t('Two years', { ns: 'dedicated_servers' }))
    .replace(
      'Automatic renewal is disabled',
      t('Automatic renewal is disabled', { ns: 'dedicated_servers' }),
    )
    .replace(
      'The service validity period has been changed',
      t('The service validity period has been changed', { ns: 'dedicated_servers' }),
    )
    .replace('The old value', t('The old value', { ns: 'dedicated_servers' }))
    .replace('The new value', t('The new value', { ns: 'dedicated_servers' }))
    .replace(
      'The service status has been changed to',
      t('The service status has been changed to', { ns: 'dedicated_servers' }),
    )
    .replace(
      'The new service validity period was set',
      t('The new service validity period was set', { ns: 'dedicated_servers' }),
    )
    .replace('Pending', t('Pending', { ns: 'dedicated_servers' }))
    .replace('Active', t('Active', { ns: 'dedicated_servers' }))
    .replace('The parameter', t('The parameter', { ns: 'dedicated_servers' }))
    .replace('has been changed', t('has been changed', { ns: 'dedicated_servers' }))
    .replace('Activation date', t('Activation date', { ns: 'dedicated_servers' }))
    .replace('New value', t('New value', { ns: 'dedicated_servers' }))
    .replace('Username', t('Username', { ns: 'dedicated_servers' }))
    .replace('Ordered', t('Ordered', { ns: 'dedicated_servers' }))

  return translate
}
