import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BreadCrumbs, Button } from '../../../../Components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { translatePeriod } from '../../../../utils'
import Select from '../../../../Components/ui/Select/Select'
import { dnsOperations, userOperations } from '../../../../Redux'
import * as routes from '../../../../routes'

import s from './DNSOrder.module.scss'

export default function FTPOrder() {
  const dispatch = useDispatch()

  const licenceCheck = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  const isSiteCareOrderAllowed = location?.state?.isDnsOrderAllowed

  const { t } = useTranslation(['dedicated_servers', 'other', 'crumbs', 'dns'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const [tarifList, setTarifList] = useState([])
  const [parameters, setParameters] = useState(null)
  const [price, setPrice] = useState('')
  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)

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

    if (words?.length > 0) {
      words?.forEach(w => {
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
    if (isSiteCareOrderAllowed) {
      dispatch(dnsOperations.getTarifs(setTarifList))
    } else {
      navigate(routes.DNS, { replace: true })
    }

    // dispatch(dnsOperations.getTarifs(setTarifList))
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
    const newData = { ...values }
    delete newData?.autoprolonglList
    delete newData?.limitsList
    dispatch(
      userOperations.cleanBsketHandler(() => dispatch(dnsOperations.orderDNS(newData))),
    )
  }

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('dns_order', { ns: 'crumbs' })}</h2>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: tarifList?.currentDatacenter,
          pricelist: null,
          period: '1',
          license: true,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, resetForm, setFieldTouched }) => {
          return (
            <Form className={s.form}>
              <Select
                height={50}
                value={values.period}
                getElement={item => {
                  setPrice('-')
                  resetForm()
                  setFieldValue('period', item)
                  setParameters(null)
                  setTarifChosen(false)

                  dispatch(
                    dnsOperations.getTarifs(setTarifList, {
                      period: item,
                      datacenter: values.datacenter,
                    }),
                  )
                }}
                isShadow
                label={`${t('payment_period')}:`}
                itemsList={tarifList?.period?.map(el => {
                  return { label: t(el?.$), value: el?.$key }
                })}
                className={classNames({ [s.select]: true, [s.period_select]: true })}
              />

              <div className={s.tarifs_block}>
                {tarifList?.tarifList
                  ?.filter(item => item?.order_available?.$ === 'on')
                  ?.map(item => {
                    const descriptionBlocks = item?.desc?.$?.split('/')
                    const cardTitle = descriptionBlocks[0]

                    const parsedPrice = parsePrice(item?.price?.$)

                    const priceAmount = parsedPrice?.amoumt

                    return (
                      <div
                        className={classNames(s.tarif_card, {
                          [s.selected]: item?.pricelist?.$ === values?.pricelist,
                        })}
                        key={item?.desc?.$}
                      >
                        <button
                          onClick={() => {
                            setParameters(null)
                            setFieldValue('pricelist', item?.pricelist?.$)
                            setPrice(priceAmount)
                            setTarifChosen(true)

                            dispatch(
                              dnsOperations.getParameters(
                                values?.period,
                                values?.datacenter,
                                item?.pricelist?.$,
                                setParameters,
                                setFieldValue,
                              ),
                            )
                          }}
                          type="button"
                          className={s.tarif_card_btn}
                        >
                          <div className={s.img_wrapper}>
                            <img
                              className={s.dns_img}
                              src={require(`../../../../images/services/${
                                item?.pricelist?.$ === '958'
                                  ? 'dns_hosting_small.webp'
                                  : 'dns_hosting_middle.webp'
                              }`)}
                              alt="dns"
                            />
                          </div>
                          <span
                            className={classNames({
                              [s.card_title]: true,
                              [s.selected]: item?.pricelist?.$ === values?.pricelist,
                            })}
                          >
                            {`${t('dns', { ns: 'crumbs' })} ${cardTitle
                              ?.split(' ')
                              .slice(1)
                              .join(' ')
                              .replace('for', t('for', { ns: 'dns' }))
                              .replace('domains', t('domains', { ns: 'dns' }))}`}
                          </span>
                          <div className={s.price_wrapper}>
                            <span
                              className={classNames({
                                [s.price]: true,
                                [s.selected]: item?.pricelist?.$ === values?.pricelist,
                              })}
                            >
                              {priceAmount + ' €' + '/' + periodName}
                            </span>
                          </div>

                          {descriptionBlocks.slice(1).map((el, i) => (
                            <span key={i} className={s.card_subtitles}>
                              {el}
                            </span>
                          ))}
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
                    {values?.limitsList?.length > 0 && (
                      <Select
                        height={50}
                        value={values[parameters?.domainsLimitAddon]}
                        label={`${t('domains_limit', { ns: 'dns' })}:`}
                        getElement={item => {
                          setFieldValue(parameters?.domainsLimitAddon, item)

                          const data = {
                            [parameters?.domainsLimitAddon]: item,
                            datacenter: values?.datacenter,
                            period: values?.period,
                            pricelist: values?.pricelist,
                          }
                          dispatch(dnsOperations.updateDNSPrice(setPrice, data))
                        }}
                        isShadow
                        itemsList={values?.limitsList?.map(el => {
                          let labeltext = el + ' ' + t('Unit')

                          return {
                            label: labeltext,
                            value: el,
                          }
                        })}
                        className={s.select}
                      />
                    )}
                  </div>

                  {/* <div className={s.terms_block} ref={licenceCheck}>
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
                        <a
                          className={s.turn_link}
                          target="_blank"
                          href={PRIVACY_URL}
                          rel="noreferrer"
                        >
                          {`"${t('terms_2')}"`}
                        </a>
                      </div>
                    </div>
                    {!!errors.license && touched.license && (
                      <p className={s.license_error}>{errors.license}</p>
                    )}
                  </div> */}
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
                        <span className={s.btn_price}>{'€' + price}</span>{' '}
                        {'/' + periodName}
                      </p>
                    </div>
                  )}

                  {/* <div className={s.sum_price_wrapper}>
                    {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                    <span className={s.btn_price}>{price + '/' + periodName}</span>
                  </div> */}

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
