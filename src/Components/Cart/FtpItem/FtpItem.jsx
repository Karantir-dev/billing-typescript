import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Delete } from '../../../images'
import s from './FtpItem.module.scss'

export default function FtpItem(props) {
  const { t } = useTranslation(['cart', 'dedicated_servers', 'other', 'vds'])

  const {
    desc,
    cost,
    discount_percent,
    fullcost,
    pricelist_name,
    // count,
    deleteItemHandler,
  } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const renderDesc = () => {
    const beforeWord = 'Control panel'
    const afterWord = '</br>'

    const managePanel = desc
      ?.slice(desc?.indexOf(beforeWord) + beforeWord?.length, desc?.indexOf(afterWord))
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
        ?.replaceAll('Unit', t('Unit', { ns: 'dedicated_servers' }))
        ?.replace('current value', t('current value', { ns: 'dedicated_servers' }))

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
          {/* {tabletOrHigher && (
            <img
              src={require('./../../../images/services/ftp_storage.webp')}
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

            <div className={s.server_info}>
              <span className={s.domainName}>{pricelist_name}</span>
              {/* &nbsp; &nbsp; {count} {t('pcs.', { ns: 'vds' })} */}
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
        </div>
      </div>
    </>
  )
}

function translatePeriod(str, t) {
  let period

  if (str.includes('for three months')) {
    period = t('for three months', { ns: 'dedicated_servers' }).toLocaleLowerCase()
  } else if (str.includes('for two years', { ns: 'dedicated_servers' })) {
    period = t('for two years', { ns: 'dedicated_servers' }).toLocaleLowerCase()
  } else if (str.includes('for three years')) {
    period = t('for three years', { ns: 'dedicated_servers' }).toLocaleLowerCase()
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
