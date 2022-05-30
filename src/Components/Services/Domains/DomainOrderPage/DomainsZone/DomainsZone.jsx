import React from 'react'
import cn from 'classnames'
import { CheckBox } from '../../../..'
import { useTranslation } from 'react-i18next'
import s from './DomainsZone.module.scss'

export default function ServicesPage(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { domains, selectedDomains, setSelectedDomains } = props

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

    let amoumt = (
      <span>
        {amounts[amounts.length - 1] + ' ' + 'EUR/'}
        <span className={s.year}>{t('year', { ns: 'other' })}</span>
      </span>
    )
    let percent = amounts[0] + '%'
    let sale = (
      <span>
        {amounts[1] + ' ' + 'EUR/'}
        <span className={s.year}>{t('year', { ns: 'other' })}</span>
      </span>
    )
    return {
      amoumt,
      percent,
      sale,
      length: amounts.length,
    }
  }

  const itemIsSelected = id => {
    return selectedDomains.indexOf(id) !== -1
  }

  const setIsSelectedHandler = id => {
    const index = selectedDomains.indexOf(id)

    if (index === -1) {
      setSelectedDomains(e => [...e, id])
    } else {
      var newArray = selectedDomains.filter(f => {
        return f !== id
      })
      setSelectedDomains(newArray)
    }
  }

  const setIsSelectedAllHandler = val => {
    if (val) {
      const items = []

      domains.forEach(d => {
        items.push(d?.id?.$)
      })

      setSelectedDomains(items)
    } else if (domains.length === selectedDomains.length) {
      setSelectedDomains([])
    }
  }

  return (
    <div className={s.domainsZone}>
      <h2 className={s.domainsZoneTitle}>{t('Domain zones')}</h2>
      <div className={s.chooseAllBlock}>
        <CheckBox
          initialState={domains.length === selectedDomains.length}
          setValue={val => setIsSelectedAllHandler(val)}
        />
        <div className={s.chooseAllText}>{t('Choose all', { ns: 'other' })}</div>
      </div>
      <div className={s.domainsBlock}>
        {domains?.map(d => {
          const { id, tld, price } = d

          return (
            <div
              tabIndex={0}
              role="button"
              onKeyDown={null}
              key={id?.$}
              className={cn(s.domainItemBg, { [s.selected]: itemIsSelected(id?.$) })}
              onClick={() => setIsSelectedHandler(id?.$)}
            >
              <div className={s.domainItem}>
                {parsePrice(price?.$)?.length > 1 && (
                  <div className={s.sale}>{parsePrice(price?.$)?.percent}</div>
                )}
                <CheckBox initialState={itemIsSelected(id?.$)} />
                <div
                  className={cn(s.domainName, { [s.selected]: itemIsSelected(id?.$) })}
                >
                  {tld?.$}
                </div>
                <div className={s.pricesBlock}>
                  <div className={s.domainPrice}>{parsePrice(price?.$)?.amoumt}</div>
                  {parsePrice(price?.$)?.length > 1 && (
                    <div className={s.saleEur}>{parsePrice(price?.$)?.sale}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
