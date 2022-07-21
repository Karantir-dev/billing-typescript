import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './ForexItem.module.scss'
import {
  // CheckBox,
  ServerState,
} from '../../..'

export default function ForexItem({ server, setActiveServer, activeServerID }) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])

  return (
    // <div className={s.item_wrapper}>
    //   <CheckBox
    //     func={isChecked => {
    //       isChecked ? setActiveServer(0) : setActiveServer(server)
    //     }}
    //   />
    <div className={s.item}>
      <button
        className={cn(s.item_btn, {
          [s.active_server]: activeServerID === server?.id?.$,
        })}
        type="button"
        onClick={() => setActiveServer(server)}
      >
        <span className={s.value}>{server?.id?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
            .replace('domains', t('domains', { ns: 'dns' }))
            .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
        </span>
        <span className={s.value}>{server?.datacentername?.$}</span>
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>
        <ServerState className={s.value} server={server} />

        <span className={s.value}>
          {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>
      </button>
    </div>
    // </div>
  )
}

ForexItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
