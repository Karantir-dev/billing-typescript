import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BreadCrumbs,
  Button,
  CheckBox,
  SoftwareOSBtn,
  SoftwareOSSelect,
  Toggle,
  Select,
  InputField,
} from '../../../../Components'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

import { dedicOperations, dedicSelectors } from '../../../../Redux'
import * as route from '../../../../routes'

import s from './DedicOrderPage.module.scss'

export default function DedicOrderPage() {
  const dispatch = useDispatch()
  const licenceCheck = useRef()
  const secondTarrif = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isDedicOrderAllowed = location?.state?.isDedicOrderAllowed

  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const { t } = useTranslation(['dedicated_servers', 'other'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const [tarifList, setTarifList] = useState(tarifsList)
  const [parameters, setParameters] = useState(null)
  // const [datacenter, setDatacenter] = useState(tarifList?.currentDatacenter)
  const [paymentPeriod, setPaymentPeriod] = useState(null)
  const [price, setPrice] = useState('')
  const [filters, setFilters] = useState([])
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

    if (words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    let amoumt = Number(amounts[amounts.length - 1]).toFixed(2) + ' ' + 'EUR'
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

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  // RENDER ALL SELECTS 'ostempl', setFieldValue, values.ostempl
  const renderSoftwareOSFields = (fieldName, setFieldValue, state, ostempl) => {
    let dataArr = parameters.find(el => el.$name === fieldName).val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software', { ns: 'vds' }) }]
    }

    dataArr.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.hasOwn(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            iconName={name}
            itemsList={optionsList}
            state={state}
            getElement={value => {
              setFieldValue(fieldName, value)

              if (fieldName === 'ostempl') {
                setFieldValue('recipe', 'null')
              }
            }}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={state}
            iconName={name}
            label={el[0].$}
            onClick={value => {
              setFieldValue(fieldName, value)
              if (fieldName === 'ostempl') {
                setFieldValue('recipe', 'null')
              }
            }}
          />
        )
      }
    })
  }

  useEffect(() => {
    if (isDedicOrderAllowed) {
      dispatch(dedicOperations.getTarifs())
    } else {
      navigate(route.DEDICATED_SERVERS, { replace: true })
    }
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
          datacenter: tarifList?.currentDatacenter,
          tarif: null,
          period: '1',
          processor: null,
          domainname: '',
          ipTotal: '1',
          price: null,
          license: null,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors, resetForm, setFieldTouched }) => {
          return (
            <Form className={s.form}>
              <div className={s.datacenter_block}>
                {tarifList?.datacenter?.map(item => {
                  let countryName = item?.$?.split(',')[0]
                  let datacenterName = item?.$?.split(',')[1]

                  return (
                    <div
                      className={classNames(s.datacenter_card, {
                        [s.selected]: item?.$key === values?.datacenter,
                      })}
                      key={item?.$key}
                    >
                      <button
                        onClick={() => {
                          setPrice('-')
                          resetForm()
                          setPaymentPeriod(item)
                          setFieldValue('datacenter', item?.$key)
                          setParameters(null)
                          setTarifChosen(false)
                          dispatch(
                            dedicOperations.getUpdatedTarrifs(item?.$key, setTarifList),
                          )
                        }}
                        type="button"
                        className={s.datacenter_card_btn}
                      >
                        <img
                          className={classNames({
                            [s.flag_icon]: true,
                            [s.selected]: item?.$key === values?.datacenter,
                          })}
                          src={require('../../../../images/countryFlags/netherlands_flag.webp')}
                          alt="nth_flag"
                        />
                        <p className={s.country_name}>{countryName}</p>
                        <span className={s.datacenter}>{datacenterName}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
              <div
                className={classNames({
                  [s.datacenter_block]: true,
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
                            resetForm()
                            setParameters(null)
                            setTarifChosen(false)
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
                            resetForm()
                            setParameters(null)
                            setTarifChosen(false)
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
                  setPrice('-')
                  resetForm()
                  setFieldValue('period', item)
                  setPaymentPeriod(item)
                  setParameters(null)
                  setTarifChosen(false)

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
                {tariffsListToRender
                  ?.filter(item => item.order_available.$ === 'on')
                  ?.map((item, index) => {
                    const descriptionBlocks = item?.desc?.$.split('/')
                    const cardTitle = descriptionBlocks[0]

                    const parsedPrice = parsePrice(item?.price?.$)

                    const priceAmount = parsedPrice.amoumt
                    const pricePercent = parsedPrice.percent
                    const priceSale = parsedPrice.sale

                    return (
                      <div
                        className={classNames(s.tarif_card, {
                          [s.selected]: item?.pricelist?.$ === values.tarif,
                        })}
                        key={item?.desc?.$}
                      >
                        <button
                          ref={index === 2 ? secondTarrif : null}
                          onClick={() => {
                            setParameters(null)
                            setFieldValue('tarif', item?.pricelist?.$)
                            setPrice(priceAmount)
                            setTarifChosen(true)

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
                          className={s.tarif_card_btn}
                        >
                          {paymentPeriod > 1 && (
                            <span
                              className={classNames({
                                [s.sale_percent]: paymentPeriod > 1,
                              })}
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
                              {priceAmount + '/' + periodName}
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
                      </div>
                    )
                  })}
              </div>

              {parameters && (
                <div className={s.parameters_block}>
                  <p className={s.params}>{t('os')}</p>
                  <div className={s.software_OS_List}>
                    {renderSoftwareOSFields('ostempl', setFieldValue, values.ostempl)}
                  </div>

                  <p className={s.params}>{t('recipe')}</p>

                  <div className={s.software_OS_List}>
                    {renderSoftwareOSFields(
                      'recipe',
                      setFieldValue,
                      values.recipe,
                      values.ostempl,
                    )}
                  </div>

                  <p className={s.params}>{t('parameters')}</p>

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

                    {/* {
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
                    } */}

                    {/* <Select
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
                    /> */}

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

                    {values.datacenter === '8' && values?.portSpeedlList?.length > 0 && (
                      <Select
                        height={50}
                        getElement={item => {
                          setFieldValue('portSpeed', item)
                          updatePrice({ ...values, portSpeed: item }, dispatch, setPrice)
                        }}
                        isShadow
                        label={t('port_speed')}
                        itemsList={values?.portSpeedlList?.map(el => {
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
                        error={!values.license && touched?.license}
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
                    {!values.license && touched?.license && (
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

function updatePrice(formValues, dispatch, setNewPrice) {
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
