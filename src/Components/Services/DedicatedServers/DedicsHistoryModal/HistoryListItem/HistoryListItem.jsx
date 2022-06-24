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
  const changedResource = str.match(
    /(?<=The resource ')(.+?)(?=' has been changed)/g,
  )?.[0]

  const newValueForResource = str.match(
    /(?<=A new value is set for \s')(.+?)(?='\.)/g,
  )?.[0]

  console.log(newValueForResource)
  let translate = str
    .replace(
      /The resource '.+' has been changed/g,
      t('The resource has been changed', { value: t(changedResource) }),
    )
    .replace(
      /A new value is set for .+?\./g,
      t('A new value is set for', { value: t(newValueForResource) }),
    )
    .replace('The tariff plan has been changed', t('The tariff plan has been changed'))
    .replace('The old plan', t('The old plan'))
    .replace('The new plan', t('The new plan'))
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
    .replace('Three months', t('Three months', { ns: 'dedicated_servers' }))
    .replace(
      'is binded to a service',
      t('is binded to a service', { ns: 'dedicated_servers' }),
    )
    .replace('Old value', t('Old value', { ns: 'dedicated_servers' }))
    .replace(
      'will be deleted from a service',
      t('will be deleted from a service', { ns: 'dedicated_servers' }),
    )
    .replace('Unit', t('Unit', { ns: 'dedicated_servers' }))
    .replace('Add-on for', t('Add-on for', { ns: 'dedicated_servers' }))
    .replace('IP-addresses count', t('IP-addresses count', { ns: 'dedicated_servers' }))
    .replace('addresses', t('addresses', { ns: 'dedicated_servers' }))
    .replace('address', t('address', { ns: 'dedicated_servers' }))
    .replace('Without a license', t('Without a license', { ns: 'dedicated_servers' }))
    .replace('Domain name', t('Domain name', { ns: 'dedicated_servers' }))
    .replace('Operating system', t('Operating system', { ns: 'dedicated_servers' }))
    .replace(
      'Preinstalled software',
      t('Preinstalled software', { ns: 'dedicated_servers' }),
    )
    .replace('Control panel', t('Control panel', { ns: 'dedicated_servers' }))
    .replace(
      'A new value is set for',
      t('A new value is set for', { ns: 'dedicated_servers' }),
    )

  return t(translate)
}
