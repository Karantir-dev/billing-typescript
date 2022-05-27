import React, { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import s from './DedicOrderModal.module.scss'
import dedicSelectors from '../../../../Redux/dedicatedServers/dedicSelectors'
import { Form, Formik } from 'formik'
// import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import Select from '../../../ui/Select/Select'
import InputField from '../../../ui/InputField/InputField'
import classNames from 'classnames'

import { BreadCrumbs, Button, CheckBox, Toggle } from '../../..'
import { useLocation } from 'react-router-dom'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'

const parsePrice = price => {
  const words = price?.match(/[\d|.|\\+]+/g)
  const amounts = []

  if (words.length > 0) {
    words.forEach(w => {
      if (!isNaN(w)) {
        amounts.push(w)
      }
    })
  } else {
    return
  }

  let amoumt = amounts[amounts.length - 1] + ' ' + 'EUR/' + '.'
  let percent = amounts[0] + '%'
  let sale = amounts[1] + ' ' + 'EUR/'

  return {
    amoumt,
    percent,
    sale,
    length: amounts.length,
  }
}

export default function DedicOrderModal() {
  const dispatch = useDispatch()

  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const { t } = useTranslation('dedicated_servers')

  const [tarifList, setTarifList] = useState(tarifsList)
  const [parameters, setParameters] = useState(null)
  const [datacenter, setDatacenter] = useState('2')
  const [paymentPeriod, setPaymentPeriod] = useState('1')
  const [price, setPrice] = useState(0)
  const [ordered, setOrdered] = useState(false)
  const [filters, setFilters] = useState([])

  let filteredTariffList = tarifList?.tarifList?.filter(el => {
    if (Array.isArray(el.filter.tag)) {
      let filterList = el.filter.tag
      console.log(filterList)
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

  console.log('ordered', ordered)

  // let priceDigit = price
  //   .split('')
  //   .filter(item => item === '.' || !isNaN(item))
  //   .join('')

  const ostempl = parameters?.filter(item => item.$name === 'ostempl')
  const recipe = parameters?.filter(item => item.$name === 'recipe')
  const managePanel = parameters?.filter(item => item.$name.includes('addon'))
  const portSpeed = parameters?.filter(item => item.$name.includes('addon'))
  const autoprolong = parameters?.filter(item => item.$name === 'autoprolong')

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
    console.log(tarifList)
  }, [tarifsList])

  // const validationSchema = Yup.object().shape({
  //   message: Yup.string().required(t('Is a required field')),
  //   subject: Yup.string().required(t('Is a required field')),
  // })

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('page_title')}</h2>

      <Formik
        // enableReinitialize
        // validationSchema={validationSchema}
        initialValues={{
          datacenter: datacenter,
          tarif: undefined,
          period: '1',
          managePanelName: managePanel?.[0]?.$name,
          processor: '',
          portSpeedName: portSpeed?.[1]?.$name,
          ipName: '',

          parameters: {
            autoprolong: autoprolong ? autoprolong[0]?.val[1]?.$key : null,
            domenname: '',
            OS: 'ISPsystem__CentOS-7-amd64',
            recipe: '',
            managePanel: '',
            ipTotal: '',
            portSpeed: '',
            price: '',
          },
        }}
        // onSubmit={() => {
        //   onSubmitt()
        // }}
      >
        {({ values, setFieldValue }) => {
          // console.log(values)

          const handleSubmit = () => {
            dispatch(
              dedicOperations.orderServer(
                values.parameters.autoprolong,
                values.datacenter,
                values.period,
                values.tarif,
                values.parameters.domenname,
                values.parameters.OS,
                values.parameters.recipe,
                values.parameters.portSpeed,
                values.managePanelName,
                values.portSpeedName,
                values.parameters.ipTotal,
                setOrdered,
              ),
            )
          }

          return (
            <Form className={s.form}>
              <div className={s.datacenter_block}>
                {tarifList?.datacenter?.map(item => {
                  let country = item?.$?.split(',')[0]
                  let centerName = item?.$?.split(',')[1]

                  return (
                    <button
                      onClick={() => {
                        setFieldValue('datacenter', item?.$key)
                        setDatacenter(item?.$key)
                        dispatch(
                          dedicOperations.getUpdatedTarrifs(item?.$key, setTarifList),
                        )
                      }}
                      type="button"
                      className={classNames(s.datacenter_card, {
                        [s.selected]: item?.$key === values.datacenter,
                      })}
                      key={item?.$key}
                    >
                      <img
                        className={classNames({
                          [s.flag_icon]: true,
                          [s.selected]: item?.$key === values.datacenter,
                        })}
                        src={require('../../../../images/countryFlags/nl.png')}
                        width={36}
                        height={24}
                        alt="flag"
                      />

                      <span className={s.country_name}>{t(country)}</span>
                      <span className={s.datacenter}>{centerName}</span>
                    </button>
                  )
                })}
              </div>

              <div className={s.processors_block}>
                <span className={s.processor}>{t('processor')}:</span>

                {tarifList?.fpricelist?.map(item => {
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

              <h3 className={s.tariff_title}>{t('tariff_plan')}:</h3>

              <Select
                height={52}
                value={''}
                getElement={item => {
                  setFieldValue('period', item)
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
                className={s.select}
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
                        setFieldValue('tarif', item?.pricelist?.$)
                        // setFieldValue('price', item?.price?.$)
                        setPrice(priceAmount)
                        dispatch(
                          dedicOperations.getParameters(
                            values.period,
                            values.datacenter,
                            item?.pricelist?.$,
                            setParameters,
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

                      <span className={s.card_title}>{cardTitle}</span>
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
                          <span
                            className={s.sale_price}
                          >{`sale price ${priceSale}`}</span>
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
                  <Select
                    height={52}
                    value={values.parameters.autoprolong}
                    label={t('autoprolong')}
                    getElement={item => setFieldValue('parameters.autoprolong', item)}
                    isShadow
                    itemsList={autoprolong[0]?.val?.map(el => {
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
                    name="parameters.domenname"
                    isShadow
                    // error={!!errors.domenname}
                    // touched={!!touched.domenname}
                    className={s.input_field_wrapper}
                    autoComplete
                  />

                  <Select
                    height={52}
                    getElement={item => setFieldValue('parameters.OS', item)}
                    isShadow
                    label={t('os')}
                    value={values.parameters.OS}
                    itemsList={ostempl[0]?.val?.map(el => {
                      return { label: t(el.$), value: el.$key }
                    })}
                    className={s.select}
                  />

                  <Select
                    height={52}
                    getElement={item => setFieldValue('parameters.recipe', item)}
                    isShadow
                    label={t('recipe')}
                    value={values.parameters.previewPS}
                    placeholder={t('recipe_placeholder')}
                    itemsList={recipe[0]?.val
                      ?.filter(e => {
                        return e.$depend === values.parameters.OS
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
                    height={52}
                    value={''}
                    getElement={item => {
                      setFieldValue('parameters.recipe', item)
                    }}
                    isShadow
                    label={t('manage_panel')}
                    itemsList={managePanel[0]?.val?.map(el => {
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
                      height={52}
                      getElement={item => setFieldValue('parameters.portSpeed', item)}
                      isShadow
                      label={t('port_speed')}
                      itemsList={portSpeed[1]?.val?.map(el => {
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

                  <InputField
                    label={t('count_ip')}
                    name="parameters.ipTotal"
                    isShadow
                    className={s.input_field_wrapper}
                    autoComplete
                  />

                  <div className={s.terms_block}>
                    <CheckBox
                      setValue={item => setFieldValue('parameters.licence', item)}
                      className={s.checkbox}
                    />
                    <div className={s.terms_text}>
                      {t('terms')}
                      <br />
                      <button type="button" className={s.turn_link}>
                        {`"${t('terms_2')}"`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={s.buy_btn_block}>
                <div className={s.sum_price_wrapper}>
                  <span className={s.btn_price}> &euro;{price}</span>
                  <span className={s.btn_period}>{`1 ${t('per month').slice(
                    0,
                    3,
                  )}.`}</span>
                </div>

                <Button
                  className={s.buy_btn}
                  isShadow
                  size="medium"
                  label={t('Buy')}
                  type="submit"
                  onClick={handleSubmit}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
