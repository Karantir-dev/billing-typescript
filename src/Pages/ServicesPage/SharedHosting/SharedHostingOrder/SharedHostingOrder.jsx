import React, { useEffect, useRef, useState } from 'react'
import { BreadCrumbs, Select, TarifCard, CheckBox, Button } from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { dnsOperations, vhostOperations } from '../../../../Redux'
import s from './SharedHostingOrder.module.scss'

export default function Component() {
  const { t } = useTranslation([
    'virtual_hosting',
    'other',
    'dedicated_servers',
    'domains',
  ])
  const dispatch = useDispatch()

  const location = useLocation()

  const licenseBlock = useRef()

  const [data, setData] = useState(null)

  const [period, setPeriod] = useState(data?.period)
  const [price, setPrice] = useState(null)

  const [paramsData, setParamsData] = useState(null)

  const [autoprolong, setAutoprolong] = useState(null)
  const [licence_agreement, setLicence_agreement] = useState(false)

  const [licence_agreement_error, setLicence_agreement_error] = useState(false)

  useEffect(() => {
    dispatch(vhostOperations.orderVhost({}, setData))
  }, [])

  useEffect(() => {
    if (data) {
      setPeriod(data?.period)
    }
  }, [data])

  useEffect(() => {
    if (paramsData) {
      setAutoprolong(paramsData?.autoprolong)
    }
  }, [paramsData])

  useEffect(() => {
    if (price) {
      dispatch(
        vhostOperations.orderParamVhost(
          {
            period,
            autoprolong: period,
            pricelist: price,
            datacenter: data?.datacenter,
          },
          setParamsData,
        ),
      )
    }
  }, [price])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const openTermsHandler = () => {
    dispatch(dnsOperations?.getPrintLicense(price))
  }

  const buyVhostHandler = () => {
    if (!licence_agreement) {
      setLicence_agreement_error(true)
      return licenseBlock.current.scrollIntoView()
    }

    const d = {
      period,
      licence_agreement: licence_agreement ? 'on' : 'off',
      autoprolong,
      pricelist: price,
      datacenter: data?.datacenter,
      sok: 'ok',
    }
    dispatch(vhostOperations.orderParamVhost(d, setParamsData))
  }

  const parsePrice = price => {
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

    return {
      amount: amounts[0],
    }
  }

  const translateAutorenewSelect = elem => {
    const price = parsePrice(elem)?.amount || 0

    let period = ''

    if (elem?.includes('per month')) {
      period = 'per month'
    } else if (elem?.includes('for three months')) {
      period = 'for three months'
    } else if (elem?.includes('half a year')) {
      period = 'half a year'
    } else if (elem?.includes('per year')) {
      period = 'per year'
    } else if (elem?.includes('for two years')) {
      period = 'for two years'
    } else if (elem?.includes('for three years')) {
      period = 'for three years'
    }

    return price + ' EUR ' + t(period)
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Virtual hosting order')}</h1>
      <div className={s.paymentWrapper}>
        <Select
          getElement={item => {
            setPeriod(item)
            setPrice(null)
            setParamsData(null)
            setLicence_agreement(false)
            dispatch(vhostOperations.orderVhost({ period: item }, setData))
          }}
          value={period}
          label={`${t('payment_period', { ns: 'dedicated_servers' })}:`}
          className={s.select}
          itemsList={data?.period_list.map(el => {
            return {
              label: t(el.$, { ns: 'other' }),
              value: el.$key,
            }
          })}
          isShadow
        />
        <div className={s.cardContainer}>
          {data?.tariflist_list?.map(tariff => {
            const { pricelist } = tariff
            const setPriceHandler = () => setPrice(pricelist?.$)
            return (
              <TarifCard
                period={data?.period_list?.filter(el => el?.$key === period)[0]?.$}
                selected={pricelist?.$ === price}
                setPriceHandler={setPriceHandler}
                key={pricelist?.$}
                tariff={tariff}
              />
            )
          })}
        </div>
        {paramsData && (
          <div className={s.parametrsContainer}>
            <div className={s.parametrsTitle}>{t('Options')}</div>
            <Select
              getElement={item => {
                setAutoprolong(item)
              }}
              value={autoprolong}
              label={`${t('Auto renewal', { ns: 'domains' })}:`}
              className={s.select}
              itemsList={paramsData?.autoprolong_list.map(el => {
                return {
                  label:
                    el.$ === 'Disabled'
                      ? t(el.$.trim())
                      : translateAutorenewSelect(el.$.trim()),
                  value: el.$key,
                }
              })}
              isShadow
            />
            <div ref={licenseBlock} className={s.useFirstCheck}>
              <CheckBox
                initialState={licence_agreement}
                setValue={item => {
                  setLicence_agreement(item)
                  setLicence_agreement_error(false)
                }}
                className={s.checkbox}
                error={licence_agreement_error}
              />
              <span className={s.agreeTerms}>
                {t('I have read and agree to the', { ns: 'domains' })}
                {'\n'}
                <button onClick={openTermsHandler} type="button">{`"${t(
                  'Terms of Service',
                  { ns: 'domains' },
                )}"`}</button>
              </span>
            </div>
          </div>
        )}
      </div>
      {price && (
        <div className={s.paymentBlock}>
          <div className={s.amountPayBlock}>
            <span>{t('topay', { ns: 'dedicated_servers' })}:</span>
            <span>
              {parsePrice(paramsData?.orderinfo)?.amount} EUR/
              {t(`${data?.period_list?.filter(el => el?.$key === period)[0]?.$}`, {
                ns: 'other',
              })}
            </span>
          </div>
          <Button
            isShadow
            className={s.buy_btn}
            size="medium"
            label={t('to_order', { ns: 'other' })}
            type="button"
            onClick={buyVhostHandler}
          />
        </div>
      )}
    </div>
  )
}
