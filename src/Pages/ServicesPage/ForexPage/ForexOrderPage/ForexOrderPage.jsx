import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BreadCrumbs, Button, CheckBox } from '../../../../Components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { translatePeriod } from '../../../../utils'

import Select from '../../../../Components/ui/Select/Select'
import { forexOperations } from '../../../../Redux'
import * as route from '../../../../routes'

import s from './ForexOrderPage.module.scss'

export default function ForexOrderPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const licenceCheck = useRef()
  const secondTarrif = useRef(null)

  const { t } = useTranslation(['dedicated_servers', 'other', 'crumbs', 'dns'])
  const location = useLocation()
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const [tarifList, setTarifList] = useState([])
  const [parameters, setParameters] = useState(null)
  const [price, setPrice] = useState('')
  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)

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

    let amoumt = Number(amounts[amounts.length - 1]).toFixed(2) + ' ' + '€'
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

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('forex_order', { ns: 'crumbs' })}</h2>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: tarifList?.currentDatacenter,
          pricelist: null,
          period: '1',
          license: null,
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
                {tarifList?.tarifList
                  ?.filter(item => item.order_available.$ === 'on')
                  ?.map((item, index) => {
                    const descriptionBlocks = item?.desc?.$.split('/')
                    const cardTitle = descriptionBlocks[0]

                    const parsedPrice = parsePrice(item?.price?.$)

                    const priceAmount = parsedPrice.amoumt

                    return (
                      <button
                        ref={index === 2 ? secondTarrif : null}
                        onClick={() => {
                          setParameters(null)
                          setFieldValue('pricelist', item?.pricelist?.$)
                          setPrice(priceAmount)
                          setTarifChosen(true)

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
                        className={classNames(s.tarif_card, {
                          [s.selected]: item?.pricelist?.$ === values.pricelist,
                        })}
                        key={item?.desc?.$}
                      >
                        <span
                          className={classNames({
                            [s.card_title]: true,
                            [s.selected]: item?.pricelist?.$ === values.pricelist,
                          })}
                        >
                          {cardTitle}
                        </span>

                        <img
                          className={s.dns_img}
                          src={require(`../../../../images/forex/${cardTitle
                            .toLocaleLowerCase()
                            .replaceAll(' ', '_')}.webp`)}
                          alt="dns"
                        />

                        <div className={s.price_wrapper}>
                          <span
                            className={classNames({
                              [s.price]: true,
                              [s.selected]: item?.pricelist?.$ === values.pricelist,
                            })}
                          >
                            {priceAmount + '/' + periodName}
                          </span>
                        </div>

                        {descriptionBlocks.slice(1).map((el, i) => (
                          <span key={i} className={s.card_subtitles}>
                            {el}
                          </span>
                        ))}
                      </button>
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
                  <div className={s.sum_price_wrapper}>
                    {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                    <span className={s.btn_price}>{price + '/' + periodName}</span>
                  </div>

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
