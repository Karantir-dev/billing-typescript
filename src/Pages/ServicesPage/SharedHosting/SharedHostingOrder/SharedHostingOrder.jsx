import React, { useEffect, useRef, useState } from 'react'
import { BreadCrumbs, Select, TarifCard, Button } from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { userOperations, vhostOperations } from '../../../../Redux'
import { useScrollToElement, translatePeriod } from '../../../../utils'
import * as routes from '../../../../routes'

import s from './SharedHostingOrder.module.scss'

export default function Component() {
  const { t } = useTranslation([
    'virtual_hosting',
    'other',
    'dedicated_servers',
    'domains',
    'autoprolong'
  ])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const licenseBlock = useRef()

  const [data, setData] = useState(null)

  const [period, setPeriod] = useState(data?.period)
  const [price, setPrice] = useState(null)

  const [paramsData, setParamsData] = useState(null)

  const [autoprolong, setAutoprolong] = useState(null)
  const [licence_agreement] = useState(true)

  const [setLicence_agreement_error] = useState(false)

  const isVhostOrderAllowed = location?.state?.isVhostOrderAllowed
  
  const [scrollElem, runScroll] = useScrollToElement({ condition: paramsData })

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')

    if (isVhostOrderAllowed || cartFromSite) {
      dispatch(vhostOperations.orderVhost({}, setData))
    } else {
      navigate(routes.SHARED_HOSTING, { replace: true })
    }
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
    const cartFromSite = localStorage.getItem('site_cart')
    const cartFromSiteJson = JSON.parse(cartFromSite)
    if (price) {
      dispatch(
        vhostOperations.orderParamVhost(
          {
            period,
            autoprolong: cartFromSiteJson ? autoprolong : period,
            pricelist: price,
            datacenter: data?.datacenter,
          },
          setParamsData,
        ),
      )
      dispatch(vhostOperations.orderVhost({ period: period }, setData))
    }
  }, [price])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    const cartFromSiteJson = JSON.parse(cartFromSite)
    if (cartFromSiteJson && data) {
      setPeriod(cartFromSiteJson?.period)
      setPrice(cartFromSiteJson?.pricelist)
      setAutoprolong(cartFromSiteJson?.autoprolong)
      localStorage.removeItem('site_cart')
    }
  }, [data])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  // const openTermsHandler = () => {
  //   dispatch(dnsOperations?.getPrintLicense(price))
  // }

  const buyVhostHandler = () => {
    if (!licence_agreement) {
      setLicence_agreement_error(true)
      return licenseBlock?.current?.scrollIntoView()
    }

    const d = {
      period,
      licence_agreement: 'on', //licence_agreement ? 'on' : 'off',
      autoprolong,
      pricelist: price,
      datacenter: data?.datacenter,
      sok: 'ok',
    }

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(vhostOperations.orderParamVhost(d, setParamsData)),
      ),
    )
  }

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

    return {
      amount: amounts[0],
    }
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
            // setLicence_agreement(false)
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
          {data?.tariflist_list
            ?.filter(plan => plan?.order_available?.$ === 'on')
            ?.map(tariff => {
              const { pricelist } = tariff
              const setPriceHandler = () => {
                setPrice(pricelist?.$)
                runScroll()
              }

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
            <div ref={scrollElem} className={s.parametrsTitle}>
              {t('Options')}
            </div>
            {period !== '-100' ? (
              <Select
                getElement={item => {
                  setAutoprolong(item)
                }}
                value={autoprolong}
                label={`${t('Auto renewal', { ns: 'domains' })}:`}
                className={s.select}
                itemsList={paramsData?.autoprolong_list?.map(el => ({
                    label: translatePeriod(el.$, t),
                    value: el.$key,
                }))}
                isShadow
              />
            ) : null}
            {/* <div ref={licenseBlock} className={s.useFirstCheck}>
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
                <a target="_blank" href={PRIVACY_URL} rel="noreferrer">{`"${t(
                  'Terms of Service',
                  { ns: 'domains' },
                )}"`}</a>
              </span>
            </div> */}
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
