import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './TarifCard.module.scss'
import { Infinity } from '../../../../images'

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
    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words.length > 0) {
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

  return (
    <div
      tabIndex={0}
      onKeyDown={null}
      role="button"
      onClick={setPriceHandler}
      className={cn(s.cardBg, { [s.selected]: selected })}
    >
      <div className={s.cardBlock}>
        <img src={require('../../../../images/vhost/VhostCloud.png')} alt="VhostCloud" />
        <div className={s.charBlock}>
          <div className={s.tariffName}>{data?.name}</div>
          <div className={s.tariffPrice}>
            {parsePrice(tariff?.price?.$)?.amount} EUR/{t(period, { ns: 'other' })}
          </div>
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
