import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Delete, Shevron } from '@images'
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { translatePeriodToMonths } from '@utils'

import s from './DedicItem.module.scss'

export default function DedicItem(props) {
  const { t } = useTranslation(['cart', 'dedicated_servers', 'other', 'vds'])

  const { desc, pricelist_name, deleteItemHandler, period, count } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const dropdownEl = useRef()
  const infoEl = useRef()

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

  const onShevronClick = () => {
    if (!dropOpened) {
      dropdownEl.current.style.height = dropdownEl.current.scrollHeight + 'px'
      if (!tabletOrHigher) {
        //
      } else {
        infoEl.current.style.marginBottom = '5px'
      }
    } else {
      dropdownEl.current.style.height = '0'
      infoEl.current.style.marginBottom = '0'
    }
    setDropOpened(!dropOpened)
  }

  return (
    <>
      <div className={s.server_item}>
        <button
          className={classNames(s.shevron_btn, { [s.opened]: dropOpened })}
          onClick={onShevronClick}
        >
          <Shevron
            className={classNames({ [s.shevron]: true, [s.opened]: dropOpened })}
          />
        </button>

        <div className={s.main_info_wrapper} ref={infoEl}>
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

          <div>
            <p className={s.tariff_name}>{pricelist_name} </p>
            <div className={s.periodInfo}>
              <span>
                {t('Period', { ns: 'other' })}: {period} {translatePeriodToMonths(period)}
              </span>
              <span>
                {t('amount', { ns: 'vds' })}: {count} {t('pcs.', { ns: 'vds' })}
              </span>
            </div>
          </div>

          {typeof deleteItemHandler === 'function' && tabletOrHigher && (
            <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
              <Delete />
            </button>
          )}
        </div>

        <div className={s.dropdown} ref={dropdownEl}>
          {renderDesc()?.ipAmount && desc.includes('IP-addresses count') && (
            <span className={s.value}>
              <b>{t('count_ip', { ns: 'dedicated_servers' })}:</b>{' '}
              {renderDesc()?.ipAmount?.split('-')[0]}, &nbsp;
            </span>
          )}

          {renderDesc()?.managePanel && desc.includes('Control panel') && (
            <span className={s.value}>
              <b>{t('manage_panel', { ns: 'dedicated_servers' })}:</b>{' '}
              {renderDesc()?.managePanel?.split('-')[0]}, &nbsp;
            </span>
          )}

          {renderDesc()?.postSpeed && desc.includes('Port speed') && (
            <span className={s.value}>
              <b>{t('port_speed', { ns: 'dedicated_servers' })}:</b>{' '}
              {renderDesc()?.postSpeed?.split('-')[0]}, &nbsp;
            </span>
          )}
        </div>
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
