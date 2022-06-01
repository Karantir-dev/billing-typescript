import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import s from './DedicOrderModal.module.scss'
import dedicSelectors from '../../../../Redux/dedicatedServers/dedicSelectors'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import Select from '../../../ui/Select/Select'
import InputField from '../../../ui/InputField/InputField'
import classNames from 'classnames'

import { BreadCrumbs, Button, CheckBox, Toggle } from '../../..'
import { useLocation } from 'react-router-dom'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { useMediaQuery } from 'react-responsive'

export default function DedicOrderModal() {
  const dispatch = useDispatch()

  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const { t } = useTranslation(['dedicated_servers', 'other'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

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

    let amoumt = Number(amounts[amounts.length - 1]).toFixed(2) + ' ' + 'EUR/' + period
    let percent = Number(amounts[0]) + '%'
    let sale = Number(amounts[1]).toFixed(2) + ' ' + 'EUR/' + period

    console.log('amout in func', Number(amounts[amounts.length - 1]).toFixed(2))
    return {
      amoumt,
      percent,
      sale,
      length: amounts.length,
    }
  }

  const [tarifList, setTarifList] = useState(tarifsList)
  const [parameters, setParameters] = useState(null)
  const [datacenter] = useState('7')
  const [paymentPeriod, setPaymentPeriod] = useState(null)
  const [price, setPrice] = useState('-')
  const [ordered, setOrdered] = useState(false)
  const [filters, setFilters] = useState([])

  // const datacenterList = [{ $: 'Netherlands Oude Meer [NL]', $key: '7' }]

  console.log(ordered)
  let filteredTariffList = tarifList?.tarifList?.filter(el => {
    if (Array.isArray(el.filter.tag)) {
      let filterList = el.filter.tag

      let hasListFilter = filterList.some(filter => filters.includes(filter.$))
      return hasListFilter
    } else {
      return filters?.includes(el.filter.tag.$)
    }
  })

  let tariffsListToRender = []

  if (filters.length === 0) {
    tariffsListToRender = tarifList?.tarifList
  } else {
    tariffsListToRender = filteredTariffList
  }

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  useEffect(() => {
    dispatch(dedicOperations.getTarifs())
  }, [])

  useEffect(() => {
    setTarifList(tarifsList)
  }, [tarifsList])

  const validationSchema = Yup.object().shape({
    tarif: Yup.string().required('tariff is required'),
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
    license: Yup.boolean()
      .required('The terms and conditions must be accepted.')
      .oneOf([true], 'The terms and conditions must be accepted.'),
  })

  const handleSubmit = values => {
    const {
      datacenter,
      tarif,
      period,
      managePanelName,
      portSpeedName,
      autoprolong,
      domainname,
      ostempl,
      recipe,
      portSpeed,
      ipTotal,
      ipName,
      managePanel,
    } = values

    dispatch(
      dedicOperations.orderServer(
        autoprolong,
        datacenter,
        period,
        tarif,
        domainname,
        ostempl,
        recipe,
        portSpeed,
        portSpeedName,
        managePanelName,
        ipTotal,
        ipName,
        managePanel,
        setOrdered,
      ),
    )
  }

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('page_title')}</h2>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: datacenter,
          tarif: null,
          period: '1',
          processor: null,
          domainname: '',
          ipTotal: '1',
          price: null,
          license: false,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors }) => {
          return (
            <Form className={s.form}>
              <div
                className={classNames({
                  [s.processors_block]: true,
                })}
              >
                <div className={s.first_processors_block}>
                  {tarifList?.fpricelist?.slice(0, 2).map(item => {
                    return (
                      <div
                        className={classNames(s.processor_card, {
                          [s.selected]: true,
                        })}
                        key={item?.$key}
                      >
                        <span className={s.processor_name}>{item?.$}</span>
                        <Toggle
                          setValue={() => {
                            setFieldValue('processor', item?.$key)
                            if (filters.includes(item?.$key)) {
                              setFilters([...filters.filter(el => el !== item?.$key)])
                            } else {
                              setFilters([...filters, item?.$key])
                            }
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className={s.second_processors_block}>
                  {tarifList?.fpricelist?.slice(2).map(item => {
                    return (
                      <div
                        className={classNames(s.processor_card, {
                          [s.selected]: true,
                        })}
                        key={item?.$key}
                      >
                        <span className={s.processor_name}>{item?.$}</span>
                        <Toggle
                          setValue={() => {
                            setFieldValue('processor', item?.$key)
                            if (filters.includes(item?.$key)) {
                              setFilters([...filters.filter(el => el !== item?.$key)])
                            } else {
                              setFilters([...filters, item?.$key])
                            }
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <Select
                height={50}
                value={values.period}
                getElement={item => {
                  setFieldValue('period', item)
                  setParameters(null)
                  setPrice(0)
                  setPaymentPeriod(item)
                  dispatch(
                    dedicOperations.getUpdatedPeriod(
                      item,
                      values.datacenter,
                      setTarifList,
                    ),
                  )
                }}
                isShadow
                label={`${t('payment_period')}:`}
                itemsList={tarifList?.period?.map(el => {
                  return { label: t(el.$), value: el.$key }
                })}
                className={classNames({ [s.select]: true, [s.period_select]: true })}
              />

              <div className={s.tarifs_block}>
                {tariffsListToRender?.map(item => {
                  const descriptionBlocks = item?.desc?.$.split('/')
                  const cardTitle = descriptionBlocks[0]

                  const parsedPrice = parsePrice(item?.price?.$)

                  const priceAmount = parsedPrice.amoumt
                  const pricePercent = parsedPrice.percent
                  const priceSale = parsedPrice.sale

                  return (
                    <button
                      onClick={() => {
                        setParameters(null)
                        setFieldValue('tarif', item?.pricelist?.$)
                        setPrice(priceAmount)
                        dispatch(
                          dedicOperations.getParameters(
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
                        [s.selected]: item?.pricelist?.$ === values.tarif,
                      })}
                      key={item?.desc?.$}
                    >
                      {paymentPeriod > 1 && (
                        <span
                          className={classNames({ [s.sale_percent]: paymentPeriod > 1 })}
                        >
                          {pricePercent}
                        </span>
                      )}

                      <span
                        className={classNames({
                          [s.card_title]: true,
                          [s.selected]: item?.pricelist?.$ === values.tarif,
                        })}
                      >
                        {cardTitle}
                      </span>
                      <div className={s.price_wrapper}>
                        <span
                          className={classNames({
                            [s.price]: true,
                            [s.selected]: item?.pricelist?.$ === values.tarif,
                          })}
                        >
                          {priceAmount}
                        </span>
                        {paymentPeriod > 1 && (
                          <span className={s.sale_price}>{`${priceSale}`}</span>
                        )}
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
                  <h3 className={s.params}>{t('parameters')}</h3>
                  <div className={s.parameters_wrapper}>
                    <Select
                      height={50}
                      value={values.autoprolong}
                      label={t('autoprolong')}
                      getElement={item => setFieldValue('autoprolong', item)}
                      isShadow
                      itemsList={values?.autoprolonglList?.map(el => {
                        let labeltext = ''
                        if (el.$.includes('per month')) {
                          labeltext = el.$.replace('per month', t('per month'))
                        } else {
                          labeltext = t(el.$)
                        }

                        return {
                          label: labeltext,
                          value: el.$key,
                        }
                      })}
                      className={s.select}
                    />
                    <InputField
                      label={t('domain_name')}
                      placeholder={t('domain_placeholder')}
                      name="domainname"
                      isShadow
                      error={!!errors.domainname}
                      touched={!!touched.domainname}
                      className={s.input_field_wrapper}
                      inputClassName={s.text_area}
                      autoComplete
                      type="text"
                      value={values?.domainname}
                    />

                    <Select
                      height={50}
                      getElement={item => {
                        setFieldValue('ostempl', item)
                        setFieldValue('recipe', 'null')
                      }}
                      isShadow
                      label={t('os')}
                      value={values?.ostempl}
                      itemsList={values?.ostemplList?.map(el => {
                        return { label: t(el.$), value: el.$key }
                      })}
                      className={s.select}
                    />

                    <Select
                      height={50}
                      getElement={item => setFieldValue('recipe', item)}
                      isShadow
                      label={t('recipe')}
                      value={values?.recipe}
                      placeholder={t('recipe_placeholder')}
                      itemsList={values?.recipelList
                        ?.filter(e => {
                          return e.$depend === values.ostempl
                        })
                        .map(el => {
                          return {
                            label:
                              el.$ === '-- none --' ? t('recipe_placeholder') : t(el.$),
                            value: el.$key,
                          }
                        })}
                      className={s.select}
                    />

                    <Select
                      height={50}
                      value={values?.managePanel}
                      getElement={item => {
                        setFieldValue('managePanel', item)
                        updatePrice({ ...values, managePanel: item }, dispatch, setPrice)
                      }}
                      isShadow
                      label={t('manage_panel')}
                      itemsList={values?.managePanellList?.map(el => {
                        console.log(el.$)
                        let labelText = el.$

                        if (labelText.includes('Without a license')) {
                          labelText = labelText.replace(
                            'Without a license',
                            t('Without a license'),
                          )
                        }

                        if (labelText.includes('per month')) {
                          labelText = labelText.replace('per month', t('per month'))
                        }

                        if (labelText.includes('Unlimited domains')) {
                          labelText = labelText.replace(
                            'Unlimited domains',
                            t('Unlimited domains'),
                          )
                        }

                        if (labelText.includes('domains')) {
                          labelText = labelText.replace('domains', t('domains'))
                        }

                        return { label: labelText, value: el.$key }
                      })}
                      className={s.select}
                    />

                    {values.datacenter === '2' && (
                      <Select
                        height={50}
                        getElement={item => {
                          setFieldValue('portSpeed', item)
                          updatePrice(values, dispatch, setPrice)
                        }}
                        isShadow
                        label={t('port_speed')}
                        itemsList={values?.portSpeed[1]?.map(el => {
                          let labelText = el.$
                          if (labelText.includes('per month')) {
                            labelText = labelText.replace('per month', t('per month'))
                          }

                          if (labelText.includes('unlimited traffic')) {
                            labelText = labelText.replace(
                              'unlimited traffic',
                              t('unlimited traffic'),
                            )
                          }

                          return { label: labelText, value: el.$key }
                        })}
                        className={s.select}
                      />
                    )}

                    <Select
                      height={50}
                      value={values?.ipTotal}
                      getElement={item => {
                        setFieldValue('ipTotal', item)
                        updatePrice({ ...values, ipTotal: item }, dispatch, setPrice)
                      }}
                      isShadow
                      label={t('count_ip')}
                      itemsList={['1', '2'].map(el => {
                        return { label: el, value: el }
                      })}
                      className={s.select}
                    />
                  </div>

                  <div className={s.terms_block}>
                    <CheckBox
                      setValue={item => setFieldValue('license', item)}
                      className={s.checkbox}
                      error={!!errors.license}
                      touched={!!errors.license}
                    />
                    <div className={s.terms_text}>
                      {t('terms')}
                      <br />
                      <button
                        type="button"
                        className={s.turn_link}
                        onClick={() => {
                          dispatch(dedicOperations.getPrintLicense(values.tarif))
                        }}
                      >
                        {`"${t('terms_2')}"`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={s.buy_btn_block}>
                <div className={s.container}>
                  <div className={s.sum_price_wrapper}>
                    {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                    <span className={s.btn_price}>{price}</span>
                  </div>

                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Buy')}
                    type="submit"
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

function updatePrice(formValues, dispatch, setNewPrice) {
  console.log(formValues.ipTotal)
  dispatch(
    dedicOperations.updatePrice(
      formValues.datacenter,
      formValues.period,
      formValues.tarif,
      formValues.domainname,
      formValues.ostempl,
      formValues.recipe,
      formValues.portSpeed,
      formValues.portSpeedName,
      formValues.managePanelName,
      formValues.ipTotal,
      formValues.ipName,
      formValues.managePanel,
      setNewPrice,
    ),
  )
}
