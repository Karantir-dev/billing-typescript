import React, { useEffect, useState, useRef } from 'react'
import {
  BreadCrumbs,
  Select,
  VpnTarifCard,
  Button,
  CheckBox,
} from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { PRIVACY_URL } from '../../../../config/config'
import { Formik, Form } from 'formik'
import { userOperations, vpnOperations } from '../../../../Redux'
import s from './VpnOrder.module.scss'
import * as routes from '../../../../routes'

export default function Component() {
  const { t } = useTranslation([
    'virtual_hosting',
    'other',
    'dedicated_servers',
    'domains',
    'crumbs',
  ])
  const dispatch = useDispatch()

  const location = useLocation()
  const licenseBlock = useRef()
  const navigate = useNavigate()

  const [data, setData] = useState(null)

  const [paramsData, setParamsData] = useState(null)

  const [licence_agreement, setLicence_agreement] = useState(true)
  const [licence_agreement_error, setLicence_agreement_error] = useState(false)
  const isSiteCareOrderAllowed = location?.state?.isSiteCareOrderAllowed

  useEffect(() => {
    if (isSiteCareOrderAllowed) {
      dispatch(vpnOperations.orderSiteCare({}, setData))
    } else {
      navigate(routes.VPN, { replace: true })
    }
  }, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  // const openTermsHandler = price => {
  //   dispatch(dnsOperations?.getPrintLicense(price))
  // }

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

  const buyVhostHandler = values => {
    // if (!licence_agreement) {
    //   setLicence_agreement_error(true)
    //   return licenseBlock.current.scrollIntoView()
    // }

    const d = {
      licence_agreement: 'on', //licence_agreement ? 'on' : 'off',
      sok: 'ok',
      ...values,
    }

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(vpnOperations.orderSiteCarePricelist(d, setParamsData)),
      ),
    )
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('vpn_order', { ns: 'crumbs' })}</h1>

      <Formik
        enableReinitialize
        initialValues={{
          datacenter: data?.datacenter || '',
          autoprolong: paramsData?.autoprolong || 'null',
          period: data?.period || '',
          pricelist: '',

          licence_agreement_error: 'off',
        }}
        onSubmit={buyVhostHandler}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form className={s.form}>
              <div className={s.paymentWrapper}>
                <Select
                  getElement={item => {
                    setFieldValue('period', item)
                    setFieldValue('pricelist', '')
                    // setFieldValue('licence_agreement_error', 'off')
                    // setLicence_agreement(false)
                    setParamsData(null)
                    dispatch(vpnOperations.orderSiteCare({ period: item }, setData))
                  }}
                  value={values?.period}
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
                    const setPriceHandler = () => {
                      setFieldValue('pricelist', pricelist?.$)
                      dispatch(
                        vpnOperations.orderSiteCarePricelist(
                          { ...values, pricelist: pricelist?.$, sv_field: 'period' },
                          setParamsData,
                        ),
                      )
                    }
                    return (
                      <VpnTarifCard
                        period={
                          data?.period_list?.filter(el => el?.$key === values?.period)[0]
                            ?.$
                        }
                        selected={pricelist?.$ === values.pricelist}
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
                    <div className={s.inputsBlock}>
                      <Select
                        getElement={item => {
                          setFieldValue('autoprolong', item)
                        }}
                        value={values?.autoprolong}
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
                  </div>
                )}
              </div>
              {values.pricelist && (
                <div className={s.paymentBlock}>
                  <div className={s.amountPayBlock}>
                    <span>{t('topay', { ns: 'dedicated_servers' })}:</span>
                    <span>
                      {parsePrice(paramsData?.orderinfo)?.amount} EUR/
                      {t(
                        `${
                          data?.period_list?.filter(el => el?.$key === values.period)[0]
                            ?.$
                        }`,
                        {
                          ns: 'other',
                        },
                      )}
                    </span>
                  </div>
                  <Button
                    isShadow
                    className={s.buy_btn}
                    size="medium"
                    label={t('to_order', { ns: 'other' })}
                    type="submit"
                  />
                </div>
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
