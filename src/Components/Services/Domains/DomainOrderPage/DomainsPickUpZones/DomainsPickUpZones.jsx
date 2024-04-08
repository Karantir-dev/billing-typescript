import { useEffect, useState } from 'react'
import cn from 'classnames'
import { Button, CheckBox, Icon } from '@components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import s from './DomainsPickUpZones.module.scss'
import { roundToDecimal } from '@utils'

export default function ServicesPage(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])

  const {
    domains,
    selectedDomains,
    setSelectedDomains,
    selected,
    registerDomainHandler,
    transfer,
    siteDomainCheckData,
  } = props

  const [domainsList, setDomainsList] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!transfer) {
      const suggested = []
      let allResults = []
      domains &&
        Object.entries(domains).forEach(d => {
          allResults.push(d)
          if (selected?.includes(d[1]?.info?.billing_id) && d[1]?.info?.is_available) {
            setIsSelectedHandler(d)
            suggested.push(d)
          }
        })
      setDomainsList({ suggested, allResults })

      /* If we have domain zones from the site - set them to selected */
      if (siteDomainCheckData.length > 0) {
        allResults = [...siteDomainCheckData]

        /* Adding transferredFromSite to Domains List to monitor if data setted from site */
        setDomainsList({ suggested, allResults, transferredFromSite: true })

        setSelectedDomains(siteDomainCheckData)
      }
    } else {
      setDomainsList(domains)
    }
  }, [domains])

  const itemIsSelected = item => selectedDomains.some(dom => dom[0] === item[0])

  const setIsSelectedHandler = item => {
    const isDomainNameSelected = selectedDomains.some(dom => dom[0] === item[0])

    if (!isDomainNameSelected) {
      // Adding element to selectedDomains
      setSelectedDomains(prevState => [...prevState, item])
    } else {
      // Removing element from selectedDomains
      const newArray = selectedDomains.filter(domain => domain[0] !== item[0])
      setSelectedDomains(newArray)
    }
  }

  /* Calculation sums of selected domain zones */
  const calculateSumOfSelected = () => {
    return selectedDomains?.reduce((sum, domain) => {
      const price = domain?.transferredFromSite ? domain : domain[1]?.info?.price
      const calculatedPrice = sum + (price?.reg ? price.reg : price?.main_price_reg)

      return +calculatedPrice.toFixed(2)
    }, 0)
  }

  const renderDomains = d => {
    /* Destructuring domainName and domainInfo depending on the object structure */
    const domainName = domainsList?.transferredFromSite ? Object.keys(d)[0] : d?.[0]
    const domainInfo = domainsList?.transferredFromSite ? Object.values(d)[0] : d?.[1]

    const { info, tld } = domainInfo
    const { billing_id, is_available, price } = info
    const { reg, main_price_reg, renew, main_price_renew } = price

    const salePercent = Math.floor(reg === 0 ? 0 : 100 - (100 * reg) / main_price_reg)

    const notAvailable = is_available === false || tld === 'invalid'

    return (
      <div
        tabIndex={0}
        role="button"
        onKeyDown={null}
        key={`domain-${billing_id}`}
        className={cn(s.domainItem, {
          [s.selected]: itemIsSelected(d),
          [s.notAvailable]: notAvailable,
        })}
        onClick={() => !notAvailable && setIsSelectedHandler(d)}
      >
        {salePercent > 0 && <div className={s.sale}>{salePercent}%</div>}

        <div className={cn(s.domainName, { [s.notAvailable]: notAvailable })}>
          <div className={s.domainNameValue}>{domainName}</div>
        </div>

        <div className={s.pricesBlock}>
          <div className={s.domainPrice}>
            {reg > 0 ? reg : main_price_reg} EUR/{t('year', { ns: 'other' })}
          </div>

          <div className={cn(s.saleEur, s.ordering)}>
            {reg && main_price_reg} EUR/{t('year', { ns: 'other' })}
          </div>
        </div>
        {main_price_renew && (
          <div className={s.prolongBlock}>
            <span>{t('prolong', { ns: 'vds' })}:</span>
            <span>
              {renew ? roundToDecimal(renew) : roundToDecimal(main_price_renew)} EUR/
              <span className={s.prolongPeriod}>{t('year', { ns: 'other' })}</span>
            </span>
          </div>
        )}
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
  }

  const renderDomainTransferAll = domainItem => {
    const [
      domain,
      {
        info: {
          is_available,
          billing_id,
          price: { reg, main_price_reg, renew, main_price_renew },
        },
      },
    ] = domainItem

    const salePercent = Math.floor(reg === 0 ? 0 : 100 - (100 * reg) / main_price_reg)

    return (
      <div
        key={`${billing_id}`}
        role="button"
        tabIndex={0}
        onKeyUp={() => {}}
        className={cn(s.domainItemTransfer, {
          [s.selected]: itemIsSelected(domainItem),
          [s.notAvailable]: is_available,
        })}
        onClick={() => setIsSelectedHandler(domainItem)}
      >
        {salePercent > 0 && <div className={s.sale}>{salePercent}%</div>}

        {!is_available && (
          <CheckBox value={itemIsSelected(domainItem)} className={s.checkbox} />
        )}
        <div className={s.domainNameTransfer}>{domain}</div>
        <div
          className={cn(s.domainavailability, {
            [s.available]: !is_available,
            [s.notAvailable]: is_available,
          })}
        >
          {!is_available ? t('Registered') : t('Not registered')}
        </div>
        <div className={s.pricesBlockTransfer}>
          {salePercent > 0 && (
            <div className={s.saleEur}>
              {reg && main_price_reg} EUR/{t('year', { ns: 'other' })}
            </div>
          )}
          <div className={s.domainPrice}>
            {reg ? reg : main_price_reg} EUR/{t('year', { ns: 'other' })}
          </div>
        </div>
        {main_price_renew && (
          <div className={s.prolongBlock}>
            <span>{t('prolong', { ns: 'vds' })}:</span>
            <span>
              {renew ? roundToDecimal(renew) : roundToDecimal(main_price_renew)} EUR/
              <span className={s.prolongPeriod}>{t('year', { ns: 'other' })}</span>
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={s.domainsZone}>
      {transfer ? (
        <>
          {Array.isArray(domainsList) && domainsList?.length > 0 && (
            <>
              <h2 className={s.domainsZoneTitle}>{t('Domain zones')}</h2>
            </>
          )}
          {domainsList ? (
            <div className={s.domainsBlockTransfer}>
              {Object?.entries(domainsList)?.map(domainItem =>
                renderDomainTransferAll(domainItem),
              )}
            </div>
          ) : null}
        </>
      ) : (
        <>
          {/* Suggested list was removed the same as on website: */}
          {/* {domainsList?.suggested?.length > 0 && (
            <>
              <h2 className={s.domainsZoneTitle}>{t('Suggested Results')}</h2>
              <div className={cn(s.domainsBlock, s.suggested)}>
                {domainsList?.suggested?.map(d => renderDomains(d))}
              </div>
            </>
          )} */}

          {domainsList?.allResults.length > 0 && (
            <>
              <h2 className={s.domainsZoneTitle}>{t('All results')}</h2>
              <div className={s.domainsBlock}>
                {domainsList?.allResults?.map(d => renderDomains(d))}
              </div>
            </>
          )}
        </>
      )}

      <div className={s.selectedDomainsBlock}>
        <div className={s.sum}>
          {t('Selected domains in the amount of')}{' '}
          <span>{calculateSumOfSelected()} EUR</span>
        </div>
        <div className={s.selectedDomains}>
          {selectedDomains?.map(e => {
            const domainName = domainsList?.transferredFromSite
              ? Object.keys(e)[0]
              : e?.[0]
            const domainInfo = domainsList?.transferredFromSite
              ? Object.values(e)[0]
              : e?.[1]

            const {
              info: { billing_id, price },
            } = domainInfo
            const { reg, main_price_reg } = price

            return (
              <div className={s.selectedItem} key={`dom_${billing_id}`}>
                <div className={s.domainName}>{domainName}</div>
                <div className={s.pricesBlock}>
                  <div className={s.domainPrice}>
                    {reg ? reg : main_price_reg} EUR/{t('year', { ns: 'other' })}
                  </div>
                </div>
                <Icon
                  name="Cross"
                  onClick={() => setIsSelectedHandler(e)}
                  className={s.cross}
                />
              </div>
            )
          })}
        </div>
        <div className={s.btnBlock}>
          <Button
            className={s.searchBtn}
            isShadow
            size="medium"
            label={t(transfer ? 'Transfer' : 'Register')}
            type="button"
            onClick={registerDomainHandler}
            disabled={selectedDomains.length === 0}
          />
          <button
            onClick={() =>
              navigate(route.DOMAINS, {
                replace: true,
              })
            }
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
