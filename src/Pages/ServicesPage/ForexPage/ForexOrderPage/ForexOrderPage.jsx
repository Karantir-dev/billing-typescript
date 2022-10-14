import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BreadCrumbs, Button, CheckBox } from '../../../../Components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { translatePeriod } from '../../../../utils'

import Select from '../../../../Components/ui/Select/Select'
import { forexOperations, selectors } from '../../../../Redux'
import * as route from '../../../../routes'

import s from './ForexOrderPage.module.scss'

export default function ForexOrderPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const licenceCheck = useRef()
  const tariffFromSite = useRef(null)

  const { t } = useTranslation([
    'dedicated_servers',
    'other',
    'crumbs',
    'dns',
    'virtual_hosting',
  ])
  const location = useLocation()
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const [tarifList, setTarifList] = useState([])
  const [parameters, setParameters] = useState(null)
  const [price, setPrice] = useState('')
  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)
  const [dataFromSite, setDataFromSite] = useState(null)

  const isForexOrderAllowed = location?.state?.isForexOrderAllowed

  const parsePrice = price => {
    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    let period

    if (price.includes('for three months')) {
      period = t('for three months').toLocaleLowerCase()
    } else if (price.includes('for two years')) {
      period = t('for two years').toLocaleLowerCase()
    } else if (price.includes('for three years')) {
      period = t('for three years').toLocaleLowerCase()
    } else if (price.includes('half a year')) {
      period = t('half a year', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('year')) {
      period = t('year', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('years')) {
      period = t('years', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('month')) {
      period = t('month', { ns: 'other' }).toLocaleLowerCase()
    } else {
      period = t('for three months', { ns: 'other' }).toLocaleLowerCase()
    }

    if (words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    let amoumt = Number(amounts[amounts.length - 1]).toFixed(2)
    let percent = Number(amounts[0]) + '%'
    let sale = Number(amounts[1]).toFixed(2) + ' ' + 'EUR'

    setPeriodName(period)

    return {
      amoumt,
      percent,
      sale,
      length: amounts.length,
    }
  }

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  useEffect(() => {
    if (isForexOrderAllowed) {
      dispatch(forexOperations.getTarifs(setTarifList))
    } else {
      navigate(route.FOREX, { replace: true })
    }
  }, [])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    const cartFromSiteJson = JSON.parse(cartFromSite)

    if (cartFromSiteJson) {
      setDataFromSite(cartFromSiteJson)
      tariffFromSite?.current?.click()

      if (parameters) {
        localStorage.removeItem('site_cart')
      }
    }
  }, [tarifList, parameters])

  const validationSchema = Yup.object().shape({
    pricelist: Yup.string().required('tariff is required'),
    license: Yup.boolean()
      .required(
        t('You must agree to the terms of the Service Agreement to be able to proceed', {
          ns: 'other',
        }),
      )
      .oneOf(
        [true],
        t('You must agree to the terms of the Service Agreement to be able to proceed', {
          ns: 'other',
        }),
      ),
  })

  const handleSubmit = values => {
    const { datacenter, pricelist, period, autoprolong, server_package } = values

    dispatch(
      forexOperations.orderForex({
        autoprolong,
        datacenter,
        period,
        pricelist,
        server_package,
      }),
    )
  }

  // console.log(dataFromSite?.pricelist, 'dataFromSite?.pricelist')
  console.log(parameters, 'params?')

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('forex_order', { ns: 'crumbs' })}</h2>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: tarifList?.currentDatacenter,
          pricelist: dataFromSite?.pricelist || null,
          period: dataFromSite ? dataFromSite?.period : '1',
          license: null,
          autoprolong: dataFromSite ? dataFromSite?.autoprolong : '1',
          autoprolonglList: dataFromSite
            ? parameters?.paramsList?.find(elem => elem?.$name === 'autoprolong')?.val
            : [],
          server_package: dataFromSite
            ? parameters?.paramsList?.find(elem => elem?.$name === 'server_package')
                ?.val[0]?.$key
            : '',
        }}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          errors,
          //   resetForm,
          setFieldTouched,
          touched,
        }) => {
          console.log(values, 'values')
          return (
            <Form className={s.form}>
              {/* <Select
                height={50}
                value={values.period}
                getElement={item => {
                  setPrice('-')
                  resetForm()
                  setFieldValue('period', item)
                  setParameters(null)
                  setTarifChosen(false)

                  dispatch(
                    forexOperations.getTarifs(setTarifList, {
                      period: item,
                      datacenter: values.datacenter,
                    }),
                  )
                }}
                isShadow
                label={`${t('payment_period')}:`}
                itemsList={tarifList?.period?.map(el => {
                  return { label: t(el.$), value: el.$key }
                })}
                className={classNames({ [s.select]: true, [s.period_select]: true })}
              /> */}

              <div className={s.tarifs_block}>
                {tarifList?.transformedTarifList
                  ?.filter(item => item.order_available.$ === 'on')
                  ?.map(item => {
                    const { countTerminal, countRAM, countMemory, osName } = item
                    const descriptionBlocks = item?.desc?.$.split('/')
                    const cardTitle = descriptionBlocks[0]

                    const parsedPrice = parsePrice(item?.price?.$)

                    const priceAmount = parsedPrice.amoumt

                    return (
                      <div
                        className={classNames(s.tarif_card, {
                          [s.selected]:
                            item?.pricelist?.$ === values?.pricelist ||
                            dataFromSite?.pricelist === item?.pricelist?.$,
                        })}
                        key={item?.desc?.$}
                      >
                        <button
                          ref={
                            dataFromSite?.pricelist === item?.pricelist?.$
                              ? tariffFromSite
                              : null
                          }
                          onClick={() => {
                            console.log(item?.pricelist?.$, 'item?.pricelist?.$')
                            const cartFromSite = localStorage.getItem('site_cart')
                            const cartFromSiteJson = JSON.parse(cartFromSite)
                            setParameters(null)
                            setFieldValue('pricelist', item?.pricelist?.$)
                            setPrice(priceAmount)
                            setTarifChosen(true)
                            if (!cartFromSiteJson) {
                              setDataFromSite(null)
                            }

                            dispatch(
                              forexOperations.getParameters(
                                values.period,
                                values.datacenter,
                                item?.pricelist?.$,
                                setParameters,
                                setFieldValue,
                              ),
                            )
                          }}
                          type="button"
                          className={s.tarif_card_btn}
                        >
                          <div className={s.dns_img_container}>
                            <img
                              className={s.dns_img}
                              src={require(`../../../../images/forex/${cardTitle
                                .toLocaleLowerCase()
                                .replaceAll(' ', '_')}.webp`)}
                              alt="dns"
                            />
                          </div>

                          <div
                            className={classNames({
                              [s.card_title_wrapper]: true,
                              [s.dt]: darkTheme,
                            })}
                          >
                            <span
                              className={classNames({
                                [s.card_title]: true,
                                [s.selected]: item?.pricelist?.$ === values.pricelist,
                              })}
                            >
                              {cardTitle}
                            </span>
                            <div className={s.price_wrapper}>
                              <span
                                className={classNames({
                                  [s.price]: true,
                                  [s.selected]: item?.pricelist?.$ === values.pricelist,
                                })}
                              >
                                {priceAmount + ' €' + '/' + periodName}
                              </span>
                            </div>
                          </div>

                          <span className={s.tarif_card_option}>{`${countTerminal} ${
                            countTerminal > 1
                              ? t('terminals', { ns: 'other' })
                              : t('terminal', { ns: 'other' })
                          }`}</span>
                          <span className={s.tarif_card_option}>{`${countRAM} ${
                            countRAM === 500 ? 'Mb' : 'Gb'
                          } ${t('RAM', { ns: 'virtual_hosting' })}`}</span>
                          <span className={s.tarif_card_option}>
                            {`${countMemory} ${t('memory', {
                              ns: 'other',
                            })}`}
                          </span>
                          <span className={s.tarif_card_option}>{`${t(osName)}`}</span>
                        </button>
                      </div>
                    )
                  })}
              </div>

              {parameters && (
                <div className={s.parameters_block}>
                  <p className={s.params}>{t('parameters')}</p>

                  <div className={s.parameters_wrapper}>
                    <Select
                      height={50}
                      value={values.autoprolong}
                      label={`${t('autoprolong')}:`}
                      getElement={item => setFieldValue('autoprolong', item)}
                      isShadow
                      itemsList={values?.autoprolonglList?.map(el => {
                        let labeltext = translatePeriod(el.$, t)

                        return {
                          label: labeltext,
                          value: el.$key,
                        }
                      })}
                      className={s.select}
                    />
                  </div>

                  <div className={s.terms_block} ref={licenceCheck}>
                    <div className={s.checkbox_wrapper}>
                      <CheckBox
                        setValue={item => {
                          if (touched.license && !!errors.license) {
                            setFieldTouched('license', true)
                          }

                          setFieldValue('license', item)
                        }}
                        className={s.checkbox}
                        error={!!errors.license && touched.license}
                      />

                      <div className={s.terms_text}>
                        {t('terms')}
                        <br />
                        <button
                          type="button"
                          className={s.turn_link}
                          onClick={() => {
                            dispatch(forexOperations.getPrintLicense(values.pricelist))
                          }}
                        >
                          {`"${t('terms_2')}"`}
                        </button>
                      </div>
                    </div>
                    {!!errors.license && touched.license && (
                      <p className={s.license_error}>{errors.license}</p>
                    )}
                  </div>
                </div>
              )}

              <div
                className={classNames({
                  [s.buy_btn_block]: true,
                  [s.active]: isTarifChosen,
                })}
              >
                <div className={s.container}>
                  {tabletOrHigher ? (
                    <div className={s.sum_price_wrapper}>
                      {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                      <span className={s.btn_price}>
                        {price + ' €' + '/' + periodName}
                      </span>
                    </div>
                  ) : (
                    <div className={s.sum_price_wrapper}>
                      {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                      <p className={s.price_wrapper}>
                        <span className={s.btn_price}>{'€' + price}</span>
                        {'/' + periodName}
                      </p>
                    </div>
                  )}

                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('buy', { ns: 'other' })}
                    type="submit"
                    onClick={() => {
                      setFieldTouched('license', true)
                      if (!values.license) setFieldValue('license', false)
                      !values.license &&
                        licenceCheck.current.scrollIntoView({ behavior: 'smooth' })
                    }}
                  />
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
