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
  } = props

  const [domainsList, setDomainsList] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!transfer) {
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
    } else {
      setDomainsList(domains)
    }
  }, [domains])

  // const parsePrice = price => {
  //   const words = price?.match(/[\d|.|\\+]+/g)
  //   const amounts = []

  //   if (words?.length > 0) {
  //     words.forEach(w => {
  //       if (!isNaN(w)) {
  //         amounts.push(w)
  //       }
  //     })
  //   } else {
  //     return
  //   }

  //   let amoumt = (
  //     <span>
  //       {roundToDecimal(amounts[amounts.length - 1]) + ' ' + 'EUR'}
  //       <span className={s.year}>
  //         {transfer ? ' ' : '/'}
  //         {t(transfer ? 'for the transfer' : 'year', { ns: 'other' })}
  //       </span>
  //     </span>
  //   )
  //   let percent = amounts[0] + '%'
  //   let sale = (
  //     <span>
  //       {roundToDecimal(amounts[1]) + ' ' + 'EUR'}
  //       <span className={s.year}>
  //         {transfer ? ' ' : '/'}
  //         {t(transfer ? '' : 'year', { ns: 'other' })}
  //       </span>
  //     </span>
  //   )
  //   return {
  //     amoumt,
  //     percent,
  //     sale,
  //     length: amounts.length,
  //   }
  // }

  const itemIsSelected = item => {
    return selectedDomains.indexOf(item) !== -1
  }

  const setIsSelectedHandler = item => {
    const index = selectedDomains.indexOf(item)

    if (index === -1) {
      // Adding element to selectedDomains
      setSelectedDomains(prevState => [...prevState, item])
    } else {
      // Removing element from selectedDomains
      const newArray = selectedDomains.filter(domain => domain !== item)
      setSelectedDomains(newArray)
    }
  }

  /* Calculation sums of selected domain zones */
  const calculateSumOfSelected = () => {
    let sum = 0

    selectedDomains?.forEach(e => {
      const [
        ,
        {
          info: { price },
        },
      ] = e

      const { reg, main_price_reg } = price

      sum += reg ? reg : main_price_reg
    })

    return roundToDecimal(sum)
  }

  const renderDomains = (d, index) => {
    // Assuming 'd' is an array:
    const [domainName, { info }] = d
    const { is_available, price } = info
    const { reg, main_price_reg, renew, main_price_renew } = price

    const salePercent = Math.floor(reg === 0 ? 0 : 100 - (100 * reg) / main_price_reg)

    const notAvailable = is_available === false || d?.tld === 'invalid'

    return (
      <div
        tabIndex={0}
        role="button"
        onKeyDown={null}
        key={`domain-${index}`}
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

  const renderDomainTransferAll = () => {
    return (
      Array.isArray(domainsList) &&
      domainsList?.length > 0 && (
        <div className={s.domainsBlockTransfer}>
          {domainsList?.map((d, index) => {
            /* Getting domain prices */
            const [
              domain,
              {
                info: {
                  is_available,
                  price: { reg, main_price_reg, renew, main_price_renew },
                },
              },
            ] = d

            const salePercent = Math.floor(
              reg === 0 ? 0 : 100 - (100 * reg) / main_price_reg,
            )
            return (
              <div
                key={`${index}`}
                className={cn(s.domainItemTransfer, {
                  [s.selected]: itemIsSelected(d),
                  [s.notAvailable]: !is_available,
                })}
              >
                {salePercent > 0 && <div className={s.sale}>{salePercent}%</div>}
                {!is_available && (
                  <CheckBox
                    value={itemIsSelected(d)}
                    onClick={() => setIsSelectedHandler(d)}
                    className={s.checkbox}
                  />
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
                      {renew ? roundToDecimal(renew) : roundToDecimal(main_price_renew)}{' '}
                      EUR/
                      <span className={s.prolongPeriod}>
                        {t('year', { ns: 'other' })}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    )
  }

  return (
    <div className={s.domainsZone}>
      {transfer ? (
        <>
          {Array.isArray(domainsList) && domainsList?.length > 0 && (
            <h2 className={s.domainsZoneTitle}>{t('Domain zones')}</h2>
          )}

          {renderDomainTransferAll()}
        </>
      ) : (
        <>
          {/* {domainsList?.suggested?.length > 0 && (
            <>
              <h2 className={s.domainsZoneTitle}>{t('Suggested Results')}</h2>
              <div className={cn(s.domainsBlock, s.suggested)}>
                {domainsList?.suggested?.map(d => renderDomains(d))}
              </div>
            </>
          )} */}

          {console.log('domainsList: ', domainsList)}
          {domainsList?.allResults.length > 0 && (
            <>
              <h2 className={s.domainsZoneTitle}>{t('All results')}</h2>
              <div className={s.domainsBlock}>
                {domainsList?.allResults?.map((d, index) => renderDomains(d, index))}
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
          {selectedDomains?.map((e, index) => {
            const [
              domainName,
              {
                info: {
                  price: { reg, main_price_reg },
                },
              },
            ] = e

            return (
              <div className={s.selectedItem} key={`dom_${index}`}>
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
