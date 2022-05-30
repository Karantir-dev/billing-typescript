import React from 'react'
import { useTranslation } from 'react-i18next'
import { ServerState } from '../..'

import s from './VDSItem.module.scss'

export default function VDSItem({ server, setActiveServer }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <li className={s.item}>
      <button
        className={s.item_btn}
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
        <span className={s.value}>{server?.datacentername?.$}</span>
        <ServerState server={server} />
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>
      </button>
    </li>
  )
}
