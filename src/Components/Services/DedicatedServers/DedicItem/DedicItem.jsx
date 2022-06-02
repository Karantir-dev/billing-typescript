import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DedicItem.module.scss'
import ServerState from '../../../vds/ServerState/ServerState'

export default function DedicItem({ server, setActiveServer, activeServerID }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <li className={s.item}>
      <button
        className={cn(s.item_btn, {
          [s.active_server]: activeServerID === server?.id?.$,
        })}
        type="button"
        onClick={() => setActiveServer(server)}
      >
        <span className={s.value}>{server?.id?.$}</span>
        <span className={s.value}>{server?.domain?.$}</span>
        <span className={s.value}>{server?.ip?.$}</span>
        <span className={s.value}>{server?.ostempl?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$}
          <span className={s.price}>
            {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>
        {/* <span className={s.value}>{server?.datacentername?.$}</span> */}
        <ServerState className={s.value} server={server} />
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>
      </button>
    </li>
  )
}

DedicItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
