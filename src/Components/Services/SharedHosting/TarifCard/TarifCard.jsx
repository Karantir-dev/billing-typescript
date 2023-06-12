import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './TarifCard.module.scss'
import { Infinity } from '@images'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const [data, setData] = useState(null)

  const { tariff, selected, setPriceHandler, period } = props

  useEffect(() => {
    const data = {}

    const newArr = tariff?.desc?.$?.split(' |')?.map(el => {
      el = el?.replace('<p>', '')
      el = el?.replace('</p>', '')
      el = el?.replace('\n', '')

      return el
    })

    newArr?.forEach((el, index) => {
      if (index === 0) {
        return (data.name = el)
      } else if (el?.includes('SSD')) {
        el = el?.replace('SSD ', '')
        return (data.ssd = el)
      } else if (el?.includes('Sites')) {
        el = el?.replace('Sites ', '')
        return (data.sites = el)
      } else if (el?.includes('Subdomains')) {
        el = el?.replace('Subdomains ', '')
        return (data.subdomains = el)
      } else if (el?.includes('Database')) {
        el = el?.replace('Database ', '')
        return (data.database = el)
      } else if (el?.includes('ОЗУ') || el?.includes('RAM')) {
        el = el?.replace('ОЗУ ', '')
        el = el?.replace('RAM ', '')
        return (data.ram = el)
      }
    })

    setData(data)
  }, [tariff])

  const parsePrice = price => {
    if (period === 'Trial period') {
      return
    }

    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words && words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    if (amounts?.length === 1) {
      return {
        amount: amounts[0],
      }
    }

    return {
      percent: amounts[0],
      old_amount: amounts[1],
      amount: amounts[2],
    }
  }

  const renderImage = name => {
    const vhostCloud = require('@images/vhost/VhostCloud.png')
    const corporate = require('@images/vhost/corporate.png')
    const favourable = require('@images/vhost/favourable.png')
    const optimal = require('@images/vhost/optimal.png')

    if (name === 'AFFORDABLE') {
      return vhostCloud
    } else if (name === 'CORPORATE') {
      return corporate
    } else if (name === 'FAVOURABLE') {
      return favourable
    } else if (name === 'OPTIMAL') {
      return optimal
    }

    return vhostCloud
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={null}
      role="button"
      onClick={
        period === 'Trial period' && data?.name !== 'AFFORDABLE' ? null : setPriceHandler
      }
      className={cn(s.cardBg, {
        [s.selected]: selected,
        [s.disabled]: period === 'Trial period' && data?.name !== 'AFFORDABLE',
      })}
    >
      <div className={s.cardBlock}>
        <img src={renderImage(data?.name)} alt="VhostCloud" />
        <div className={s.charBlock}>
          <div className={s.tariffName}>{data?.name}</div>
          <div
            className={cn(s.tariffPrice, {
              [s.freeTrial]: period === 'Trial period' && data?.name === 'AFFORDABLE',
            })}
          >
            {period === 'Trial period' && data?.name !== 'AFFORDABLE'
              ? t(tariff?.price?.$?.trim())
              : period === 'Trial period' && data?.name === 'AFFORDABLE'
              ? `0.00 EUR ${t('for 10 days')}`
              : `${parsePrice(tariff?.price?.$)?.amount} EUR/${t(period, {
                  ns: 'other',
                })}`}
          </div>
          {parsePrice(tariff?.price?.$)?.percent && (
            <span className={s.old_price}>
              <span className={s.percent}>{parsePrice(tariff?.price?.$)?.percent}%</span>{' '}
              {parsePrice(tariff?.price?.$)?.old_amount} EUR/{t(period, { ns: 'other' })}
            </span>
          )}
          <div className={s.line} />
          <div className={s.charText}>
            {data?.ssd === 'unlimited' ? <Infinity /> : data?.ssd} SSD
          </div>
          <div className={s.charText}>
            {data?.sites === 'unlimited' ? <Infinity /> : data?.sites} {t('Sites')}
          </div>
          <div className={s.charText}>
            {data?.subdomains === 'unlimited' ? <Infinity /> : data?.subdomains}{' '}
            {t('Subdomains')}
          </div>
          <div className={s.charText}>
            {data?.database === 'unlimited' ? <Infinity /> : data?.database}{' '}
            {t('Database')}
          </div>
          <div className={s.charText}>
            {data?.ram === 'unlimited' ? <Infinity /> : data?.ram} {t('RAM')}
          </div>
        </div>
      </div>
    </div>
  )
}
