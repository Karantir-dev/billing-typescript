import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Cross } from '../../../../../images'
import { Button } from '../../../../'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '../../../../../routes'
import s from './DomainsPickUpZones.module.scss'

export default function ServicesPage(props) {
  const { t } = useTranslation(['domains', 'other'])

  const {
    domains,
    selectedDomains,
    setSelectedDomains,
    selected,
    registerDomainHandler,
  } = props

  const [domainsList, setDomainsList] = useState(null)

  const navigate = useNavigate()

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

  const itemIsSelected = item => {
    return selectedDomains.indexOf(item) !== -1
  }

  const setIsSelectedHandler = item => {
    const index = selectedDomains.indexOf(item)

    if (index === -1) {
      setSelectedDomains(e => [...e, item])
    } else {
      var newArray = selectedDomains.filter(f => {
        return f !== item
      })
      setSelectedDomains(newArray)
    }
  }

  const calculateSumOfSelected = () => {
    let sum = 0

    selectedDomains?.forEach(e => {
      const words = e?.price?.$?.match(/[\d|.|\\+]+/g)
      const amounts = []

      if (words.length > 0) {
        words.forEach(w => {
          if (!isNaN(w)) {
            amounts.push(w)
          }
        })
      }
      sum = sum + Number(amounts[amounts.length - 1])
    })

    return sum.toFixed(2)
  }

  useEffect(() => {
    const suggested = []
    const allResults = []
    domains?.forEach(d => {
      if (selected?.indexOf(d?.checkbox?.input?.$name) !== -1) {
        suggested.push(d)
        setIsSelectedHandler(d)
      } else {
        allResults.push(d)
      }
    })
    setDomainsList({ suggested, allResults })
  }, [domains])

  return (
    <div className={s.domainsZone}>
      {domainsList?.suggested?.length > 0 && (
        <h2 className={s.domainsZoneTitle}>{t('Suggested Results')}</h2>
      )}

      {domainsList?.suggested?.length > 0 && (
        <div className={cn(s.domainsBlock, s.suggested)}>
          {domainsList?.suggested?.map(d => {
            const { id, domain, price } = d

            return (
              <div
                tabIndex={0}
                role="button"
                onKeyDown={null}
                key={id?.$}
                className={cn(s.domainItem, { [s.selected]: itemIsSelected(d) })}
                onClick={() => setIsSelectedHandler(d)}
              >
                {parsePrice(price?.$)?.length > 1 && (
                  <div className={s.sale}>{parsePrice(price?.$)?.percent}</div>
                )}
                <div className={s.domainName}>{domain?.$}</div>
                <div className={s.pricesBlock}>
                  <div className={s.domainPrice}>{parsePrice(price?.$)?.amoumt}</div>
                  {parsePrice(price?.$)?.length > 1 && (
                    <div className={s.saleEur}>{parsePrice(price?.$)?.sale}</div>
                  )}
                </div>
                <div className={cn(s.selectBtn, { [s.selected]: itemIsSelected(d) })}>
                  {itemIsSelected(d) ? t('Selected') : t('Select')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {domainsList?.allResults?.length > 0 && (
        <h2 className={s.domainsZoneTitle}>{t('All results')}</h2>
      )}

      {domainsList?.allResults?.length > 0 && (
        <div className={s.domainsBlock}>
          {domainsList?.allResults?.map(d => {
            const { id, domain, price } = d

            const notAvailable = d?.desc?.$.includes('Not available')

            return (
              <div
                tabIndex={0}
                role="button"
                onKeyDown={null}
                key={id?.$}
                className={cn(s.domainItem, {
                  [s.selected]: itemIsSelected(d),
                  [s.notAvailable]: notAvailable,
                })}
                onClick={() => !notAvailable && setIsSelectedHandler(d)}
              >
                {parsePrice(price?.$)?.length > 1 && (
                  <div className={s.sale}>{parsePrice(price?.$)?.percent}</div>
                )}
                <div className={s.domainName}>
                  <div>{domain?.$}</div>
                  <div className={s.domainPriceMobile}>{parsePrice(price?.$)?.amoumt}</div>
                  {parsePrice(price?.$)?.length > 1 && (
                    <div className={s.saleEurMobile}>{parsePrice(price?.$)?.sale}</div>
                  )}
                </div>
                <div className={s.pricesBlock}>
                  <div className={s.domainPrice}>{parsePrice(price?.$)?.amoumt}</div>
                  {parsePrice(price?.$)?.length > 1 && (
                    <div className={s.saleEur}>{parsePrice(price?.$)?.sale}</div>
                  )}
                </div>
                <div
                  className={cn(s.selectBtn, {
                    [s.selected]: itemIsSelected(d),
                    [s.notAvailable]: notAvailable,
                  })}
                >
                  {notAvailable
                    ? t('Not available')
                    : itemIsSelected(d)
                    ? t('Selected')
                    : t('Select')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className={s.selectedDomainsBlock}>
        <div className={s.sum}>
          {t('Selected domains in the amount of')}{' '}
          <span>{calculateSumOfSelected()} EUR</span>
        </div>
        <div className={s.selectedDomains}>
          {selectedDomains?.map(e => {
            return (
              <div className={s.selectedItem} key={e?.id?.$}>
                <div className={s.domainName}>{e?.domain?.$}</div>
                <div className={s.pricesBlock}>
                  <div className={s.domainPrice}>{parsePrice(e?.price?.$)?.amoumt}</div>
                </div>
                <Cross onClick={() => setIsSelectedHandler(e)} className={s.cross} />
              </div>
            )
          })}
        </div>
        <div className={s.btnBlock}>
          <Button
            className={s.searchBtn}
            isShadow
            size="medium"
            label={t('Register')}
            type="button"
            onClick={registerDomainHandler}
            disabled={selectedDomains.length === 0}
          />
          <button
            onClick={() => navigate(route.DOMAINS)}
            type="button"
            className={s.clearFilters}
          >
            {t('Cancel', { ns: 'other' })}
          </button>
        </div>
      </div>
    </div>
  )
}
