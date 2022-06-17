import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DNSItem.module.scss'
import { ServerState } from '../../..'

export default function DNSItem({ storage, setActiveServer, activeServerID }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <li className={s.item}>
      <button
        className={cn(s.item_btn, {
          [s.active_server]: activeServerID === storage?.id?.$,
        })}
        type="button"
        onClick={() => setActiveServer(storage)}
      >
        <span className={s.value}>{storage?.id?.$}</span>
        <span className={s.value}>{storage?.pricelist?.$}</span>
        <span className={s.value}>{storage?.datacentername?.$}</span>
        <span className={s.value}>{storage?.createdate?.$}</span>
        <span className={s.value}>{storage?.expiredate?.$}</span>
        <ServerState className={s.value} server={storage} />

        <span className={s.value}>
          {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>
      </button>
    </li>
  )
}

DNSItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
