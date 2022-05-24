import React from 'react'
import { CheckBox } from '../../../..'
import { useTranslation } from 'react-i18next'
import s from './DomainsZone.module.scss'

export default function ServicesPage(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { domains } = props

  console.log(domains)

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

    return amounts[amounts.length - 1] + ' ' + 'EUR'
  }

  return (
    <div className={s.domainsZone}>
      <h2 className={s.domainsZoneTitle}>{t('Domain zones')}</h2>
      <h3 className={s.domainsZoneText}>
        {t('Desirable areas for searching for free domain names')}
      </h3>
      <div className={s.domainsBlock}>
        {domains?.map(d => {
          const { id, tld, price } = d
          return (
            <div className={s.domainItem} key={id?.$}>
              <CheckBox />
              <div className={s.domainName}>{tld?.$}</div>
              <div className={s.domainPrice}>{parsePrice(price?.$)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
