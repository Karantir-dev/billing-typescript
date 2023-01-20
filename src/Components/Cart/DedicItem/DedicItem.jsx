import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Delete, Shevron } from '../../../images'
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive'

import s from './DedicItem.module.scss'

export default function DedicItem(props) {
  const { t } = useTranslation(['cart', 'dedicated_servers', 'other', 'vds'])

  const {
    desc,
    cost,
    discount_percent,
    fullcost,
    pricelist_name,
    count,
    deleteItemHandler,
  } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const [dropOpened, setDropOpened] = useState(false)

  const renderDesc = () => {
    const beforeWord = 'Control panel'
    const afterWord = '</br>'

    const managePanel = desc
      ?.slice(desc.indexOf(beforeWord) + beforeWord?.length, desc.indexOf(afterWord))
      ?.replace(
        'Without a license<br/>IP',
        t('Without a license', { ns: 'dedicated_servers' }),
      )

    const beforeWordIP = 'IP-addresses count'
    const afterWordIP = 'Unit'

    const ipAmount =
      desc?.slice(
        desc?.indexOf(beforeWordIP) + beforeWordIP?.length,
        desc?.indexOf(afterWordIP),
      ) +
      'Unit'
        .replaceAll('Unit', t('Unit', { ns: 'dedicated_servers' }))
        .replace('current value', t('current value', { ns: 'dedicated_servers' }))

    const beforeWordSpeed = 'Port speed'
    const afterWordSpeed = '</br>'

    const postSpeed = desc?.slice(
      desc?.indexOf(beforeWordSpeed) + beforeWordSpeed?.length,
      desc?.indexOf(afterWordSpeed),
    )

    const paymentPeriod = desc?.split(' ')?.reverse()
    let curPeriod = []

    for (let i = 0; i <= paymentPeriod.length; i++) {
      curPeriod.push(paymentPeriod[i])
      if (paymentPeriod[i + 1] === 'EUR') {
        break
      }
    }

    const periodStr = curPeriod?.reverse()?.join(' ')

    const period = translatePeriod(periodStr, t)

    return {
      managePanel,
      ipAmount,
      postSpeed,
      period,
    }
  }

  return (
    <>
      <div className={s.server_item}>
        <div className={s.tarif_info}>
          <button
            onClick={() => setDropOpened(!dropOpened)}
            className={s.shevron_container}
          >
            <Shevron
              className={classNames({ [s.shevron]: true, [s.opened]: dropOpened })}
            />
          </button>

          {/* {tabletOrHigher && (
            <img
              src={require('./../../../images/services/dedicated.webp')}
              alt="dedicated_servers"
            />
          )} */}

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
            {/* 
            {tabletOrHigher && (
              <p className={s.countItem}>
                {count} {t('pcs.', { ns: 'vds' })}
              </p>
            )} */}

            <div className={s.server_info}>
              <span className={s.domainName}>
                <span>{pricelist_name}</span>
                <p className={s.countItem}>
                  {count} {t('pcs.', { ns: 'vds' })}
                </p>
              </span>
            </div>
            <div className={s.costBlock}>
              <div className={s.cost}>
                {cost} {`EUR/${renderDesc()?.period}`}
              </div>
              {discount_percent && (
                <div className={s.discountBlock}>
                  <span className={s.discountPerCent}>-{discount_percent}</span>
                  <span className={s.fullcost}>{fullcost} EUR</span>
                </div>
              )}
            </div>
            {typeof deleteItemHandler === 'function' && tabletOrHigher && (
              <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
                <Delete />
              </button>
            )}
          </div>
          {!tabletOrHigher && (
            <div
              className={classNames({
                [s.additional_info_item]: true,
                [s.opened]: dropOpened,
              })}
            >
              {renderDesc()?.ipAmount && desc.includes('IP-addresses count') && (
                <p className={s.service_name}>
                  {t('count_ip', { ns: 'dedicated_servers' })}:
                  {renderDesc()?.ipAmount?.split('-')[0]}
                </p>
              )}
              {renderDesc()?.managePanel && desc.includes('Control panel') && (
                <p className={s.service_name}>
                  {t('manage_panel', { ns: 'dedicated_servers' })}:
                  {renderDesc()?.managePanel?.split('-')[0]}
                </p>
              )}
              {renderDesc()?.postSpeed && desc.includes('Port speed') && (
                <p className={s.service_name}>
                  {t('port_speed', { ns: 'dedicated_servers' })}:
                  {renderDesc()?.postSpeed?.split('-')[0]}
                </p>
              )}
            </div>
          )}
        </div>
        {tabletOrHigher && (
          <div
            className={classNames({
              [s.additional_info_item]: true,
              [s.opened]: dropOpened,
            })}
          >
            {renderDesc()?.ipAmount && desc.includes('IP-addresses count') && (
              <p className={s.service_name}>
                {t('count_ip', { ns: 'dedicated_servers' })}:
                {renderDesc()?.ipAmount?.split('-')[0]}
              </p>
            )}
            {renderDesc()?.managePanel && desc.includes('Control panel') && (
              <p className={s.service_name}>
                {t('manage_panel', { ns: 'dedicated_servers' })}:
                {renderDesc()?.managePanel?.split('-')[0]}
              </p>
            )}
            {renderDesc()?.postSpeed && desc.includes('Port speed') && (
              <p className={s.service_name}>
                {t('port_speed', { ns: 'dedicated_servers' })}:
                {renderDesc()?.postSpeed?.split('-')[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function translatePeriod(str, t) {
  let period

  if (str.includes('for three months')) {
    period = t('for three months', { ns: 'dedicated_servers' }).toLocaleLowerCase()
  } else if (str.includes('for two years')) {
    period = t('for two years').toLocaleLowerCase()
  } else if (str.includes('for three years')) {
    period = t('for three years').toLocaleLowerCase()
  } else if (str.includes('half a year')) {
    period = t('half a year', { ns: 'other' }).toLocaleLowerCase()
  } else if (str.includes('year')) {
    period = t('year', { ns: 'other' }).toLocaleLowerCase()
  } else if (str.includes('years')) {
    period = t('years', { ns: 'other' }).toLocaleLowerCase()
  } else if (str.includes('month')) {
    period = t('month', { ns: 'other' }).toLocaleLowerCase()
  } else {
    period = t('for three months', { ns: 'other' }).toLocaleLowerCase()
  }

  return period
}
