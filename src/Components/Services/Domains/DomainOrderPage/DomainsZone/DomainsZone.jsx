import cn from 'classnames'
import { CheckBox } from '@components'
import { useTranslation } from 'react-i18next'
import s from './DomainsZone.module.scss'
import { ErrorMessage } from 'formik'
import { roundToDecimal } from '@utils'

export default function ServicesPage(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])

  const { domains, selectedDomains, setSelectedDomains, transfer, autoprolongPrices } =
    props
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
        {roundToDecimal(amounts[amounts.length - 1]) + ' ' + 'EUR'}
        <span className={s.year}>
          {transfer ? ' ' : '/'}
          {t(transfer ? 'for the transfer' : 'year', { ns: 'other' })}
        </span>
      </span>
    )
    let percent = amounts[0] + '%'
    let sale = (
      <span>
        {roundToDecimal(amounts[1]) + ' ' + 'EUR'}
        <span className={s.year}>
          {transfer ? ' ' : '/'}
          {t(transfer ? 'for the transfer' : 'year', { ns: 'other' })}
        </span>
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

  return (
    <div className={s.domainsZone}>
      <h2 className={s.domainsZoneTitle}>{t('Domain zones')}</h2>
      <ErrorMessage className={s.error_message} name="selectedDomains" component="span" />
      <div className={cn(s.domainsBlock, { [s.transfer]: transfer })}>
        {domains?.map(d => {
          const { id, tld, price } = d
          const selected = itemIsSelected(id?.$)
          const renew = autoprolongPrices.find(el => el.zone === tld.$)?.main_price_renew
          return (
            <div
              tabIndex={0}
              role="button"
              onKeyDown={null}
              key={id?.$}
              className={cn(s.domainItemBg, {
                [s.selected]: selected,
                [s.transfer]: transfer,
              })}
              onClick={() => setIsSelectedHandler(id?.$)}
            >
              <div className={cn(s.domainItem, { [s.transfer]: transfer })}>
                {parsePrice(price?.$)?.length > 1 && (
                  <div className={s.sale}>-{parsePrice(price?.$)?.percent}</div>
                )}
                <CheckBox className={s.checkbox} value={selected} />

                <div
                  className={cn(s.domainName, {
                    [s.selected]: selected,
                    [s.transfer]: transfer,
                  })}
                >
                  {tld?.$}
                </div>
                <div className={cn(s.pricesBlock, { [s.transfer]: transfer })}>
                  <div className={s.domainPrice}>{parsePrice(price?.$)?.amoumt}</div>
                  {parsePrice(price?.$)?.length > 1 && (
                    <div className={s.saleEur}>{parsePrice(price?.$)?.sale}</div>
                  )}
                </div>
                {renew && (
                  <div className={s.prolongBlock}>
                    <span>{t('prolong', { ns: 'vds' })}:</span>
                    <span>
                      {roundToDecimal(renew)} EUR/
                      <span className={s.prolongPeriod}>
                        {t('year', { ns: 'other' })}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
