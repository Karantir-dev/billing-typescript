import React, { useEffect, useState, useRef } from 'react'
import {
  BreadCrumbs,
  Select,
  SiteCareTarifCard,
  Button,
  InputField,
  CheckBox,
} from '../../../../Components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { siteCareOperations, dnsOperations } from '../../../../Redux'
import s from './SiteCareOrder.module.scss'
import * as Yup from 'yup'

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

  const [paramsData, setParamsData] = useState(null)

  const [licence_agreement, setLicence_agreement] = useState(false)
  const [licence_agreement_error, setLicence_agreement_error] = useState(false)

  useEffect(() => {
    dispatch(siteCareOperations.orderSiteCare({}, setData))
  }, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const openTermsHandler = price => {
    dispatch(dnsOperations?.getPrintLicense(price))
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

  const buyVhostHandler = values => {
    if (!licence_agreement) {
      setLicence_agreement_error(true)
      return licenseBlock.current.scrollIntoView()
    }

    const d = {
      licence_agreement: licence_agreement ? 'on' : 'off',
      sok: 'ok',
      ...values,
    }
    dispatch(siteCareOperations.orderSiteCarePricelist(d, setParamsData))
  }

  const validationSchema = Yup.object().shape({
    ipServer: Yup.string().required(t(' ')),
    loginServer: Yup.string().required(t(' ')),
    passwordServer: Yup.string().required(t(' ')),
    port: Yup.string().required(t(' ')),
    url: Yup.string().required(t(' ')),
  })

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Website care order')}</h1>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: data?.datacenter || '',
          autoprolong: paramsData?.autoprolong || 'null',
          period: data?.period || '',
          pricelist: '',

          ipServer: '',
          loginServer: '',
          passwordServer: '',
          port: '',
          url: '',
          licence_agreement_error: 'off',
        }}
        onSubmit={buyVhostHandler}
      >
        {({ setFieldValue, values, errors, touched }) => {
          return (
            <Form className={s.form}>
              <div className={s.paymentWrapper}>
                <Select
                  getElement={item => {
                    setFieldValue('period', item)
                    setFieldValue('pricelist', '')
                    setParamsData(null)
                    dispatch(siteCareOperations.orderSiteCare({ period: item }, setData))
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
                        siteCareOperations.orderSiteCarePricelist(
                          { ...values, pricelist: pricelist?.$, sv_field: 'period' },
                          setParamsData,
                        ),
                      )
                    }
                    return (
                      <SiteCareTarifCard
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

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'loginServer'}
                        placeholder={t('Enter login')}
                        label={`${t('Login')}:`}
                        isShadow
                        className={s.input}
                        error={!!errors.loginServer}
                        touched={!!touched.loginServer}
                        isRequired
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        placeholder={t('Enter password')}
                        name={'passwordServer'}
                        label={`${t('Password')}:`}
                        isShadow
                        className={s.input}
                        error={!!errors.passwordServer}
                        touched={!!touched.passwordServer}
                        isRequired
                      />

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        placeholder={t('Enter URL')}
                        name={'url'}
                        label={`${t('Site URL')}:`}
                        isShadow
                        className={s.input}
                        error={!!errors.url}
                        touched={!!touched.url}
                        isRequired
                      />

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        placeholder={t('Enter Port')}
                        name={'port'}
                        label={`${t('Port')}:`}
                        isShadow
                        className={s.input}
                        error={!!errors.port}
                        touched={!!touched.port}
                        isRequired
                      />

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        placeholder={t('Enter IP')}
                        name={'ipServer'}
                        label={`${t('IP address')}:`}
                        isShadow
                        className={s.input}
                        error={!!errors.ipServer}
                        touched={!!touched.ipServer}
                        isRequired
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
                          <button
                            onClick={() => openTermsHandler(values.pricelist)}
                            type="button"
                          >{`"${t('Terms of Service', { ns: 'domains' })}"`}</button>
                        </span>
                      </div>
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
