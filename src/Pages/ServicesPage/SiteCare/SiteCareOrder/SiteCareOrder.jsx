import { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  Select,
  SiteCareTarifCard,
  Button,
  InputField,
  Loader,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { siteCareOperations, siteCareSelectors, userOperations } from '@redux'
import { useScrollToElement, translatePeriod, ipRegex, useCancelRequest } from '@utils'
import { URL_REGEX, PASS_REGEX } from '@utils/constants'

import s from './SiteCareOrder.module.scss'
import * as Yup from 'yup'
import * as routes from '@src/routes'

export default function Component() {
  const { t } = useTranslation([
    'virtual_hosting',
    'other',
    'dedicated_servers',
    'domains',
    'autoprolong',
    'auth',
  ])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()
  const isLoading = useSelector(siteCareSelectors.getIsLoadingSiteCare)
  const signal = useCancelRequest()

  const [data, setData] = useState(null)

  const [paramsData, setParamsData] = useState(null)

  const isSiteCareOrderAllowed = location?.state?.isSiteCareOrderAllowed
  const [scrollElem, runScroll] = useScrollToElement({ condition: paramsData })

  useEffect(() => {
    if (isSiteCareOrderAllowed) {
      dispatch(siteCareOperations.orderSiteCare({}, setData, signal))
    } else {
      navigate(routes.SITE_CARE, { replace: true })
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
        dispatch(siteCareOperations.orderSiteCarePricelist(d, setParamsData, signal)),
      ),
    )
  }

  const validationSchema = Yup.object().shape({
    ipServer: Yup.string()
      .required(t('Enter IP'))
      .test('ip-validate', t('invalid_ip'), value => ipRegex().test(value)),
    loginServer: Yup.string().required(t('Enter login')),
    passwordServer: Yup.string()
      .required(t('Enter password'))
      .matches(PASS_REGEX, t('warnings.invalid_pass', { ns: 'auth', min: 12, max: 48 })),
    port: Yup.number()
      .required(t('Enter Port'))
      .integer(t('invalid_port_range'))
      .min(0, t('invalid_port_range'))
      .max(65535, t('invalid_port_range')),
    url: Yup.string().required(t('Enter URL')).matches(URL_REGEX, 'http://domain.com'),
  })

  return (
    <>
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
                      dispatch(
                        siteCareOperations.orderSiteCare(
                          { period: item },
                          setData,
                          signal,
                        ),
                      )
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
                            signal,
                          ),
                        )
                        runScroll()
                      }
                      return (
                        <SiteCareTarifCard
                          period={
                            data?.period_list?.filter(
                              el => el?.$key === values?.period,
                            )[0]?.$
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
                      <div ref={scrollElem} className={s.parametrsTitle}>
                        {t('Options')}
                      </div>
                      <div className={s.inputsBlock}>
                        <Select
                          getElement={item => {
                            setFieldValue('autoprolong', item)
                          }}
                          value={values?.autoprolong}
                          label={`${t('Auto renewal', { ns: 'domains' })}:`}
                          className={s.select}
                          itemsList={paramsData?.autoprolong_list.map(el => ({
                            label: translatePeriod(el.$, t),
                            value: el.$key,
                          }))}
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
                          label={`SSH ${t('Port')}:`}
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
      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
