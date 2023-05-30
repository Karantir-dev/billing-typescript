import React from 'react'
import { useTranslation } from 'react-i18next'
import { translatePeriodToMonths } from '../../../utils'
import { useMediaQuery } from 'react-responsive'

import s from './DnsItem.module.scss'
import { Delete } from '../../../images'

export default function DnsItem(props) {
  const { t } = useTranslation([
    'cart',
    'dedicated_servers',
    'other',
    'dns',
    'crumbs',
    'vds',
  ])

  const { pricelist_name, deleteItemHandler, count, period } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <>
      <div className={s.server_item}>
        <div className={s.tarif_info}>
          <div className={s.priceList}>
            {!tabletOrHigher && (
              <div className={s.control_bts_wrapper}>
                {typeof deleteItemHandler === 'function' && (
                  <button
                    className={s.btn_delete}
                    type="button"
                    onClick={deleteItemHandler}
                  >
                    <Delete />
                  </button>
                )}
              </div>
            )}

            <div className={s.server_info}>
              <span className={s.domainName}>
                {pricelist_name
                  ?.replace('for', t('for', { ns: 'dns' }))
                  ?.replace('domains', t('domains', { ns: 'dns' }))
                  ?.replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}{' '}
              </span>
              <div className={s.periodInfo}>
                <span>
                  {t('Period', { ns: 'other' })}: {period}{' '}
                  {translatePeriodToMonths(period)}
                </span>
                <span>
                  {t('amount', { ns: 'vds' })}: {count} {t('pcs.', { ns: 'vds' })}
                </span>
                <span></span>
              </div>
            </div>

            {typeof deleteItemHandler === 'function' && tabletOrHigher && (
              <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
                <Delete />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
