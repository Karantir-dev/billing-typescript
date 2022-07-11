import React, { useEffect, useRef, useState } from 'react'
import { ErrorMessage, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'
import {
  BreadCrumbs,
  Select,
  InputField,
  SoftwareOSBtn,
  SoftwareOSSelect,
  Button,
} from '../../../../Components'
import { Check } from '../../../../images'
import { vdsOperations, dnsOperations } from '../../../../Redux'
import { DOMAIN_REGEX } from '../../../../utils'

import cn from 'classnames'
import * as Yup from 'yup'
import s from './VDSOrder.module.scss'

export default function VDSOrder() {
  const location = useLocation()
  const dispatch = useDispatch()
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation(['vds', 'other', 'crumbs', 'dedicated_servers'])
  const agreementEl = useRef()
  const checkboxEl = useRef()

  const [formInfo, setFormInfo] = useState(null)
  const [period, setPeriod] = useState('1')
  const [tariffsList, setTariffsList] = useState([])
  const [tariffCategory, setTariffCategory] = useState()
  const [selectedTariffId, setSelectedTariffId] = useState()
  const [parametersInfo, setParametersInfo] = useState()
  const [count, setCount] = useState(1)
  const [recipe, setRecipe] = useState('null')

  const filteredList = tariffsList.filter(el =>
    tariffCategory ? el.filter.tag.$ === tariffCategory : true,
  )

  useEffect(() => {
    const isInList = filteredList.some(el => el.pricelist.$ === selectedTariffId)
    if (!isInList && selectedTariffId) {
      setSelectedTariffId(null)
      setParametersInfo(null)
      setCount(1)
    }
  }, [tariffCategory])

  useEffect(() => {
    dispatch(vdsOperations.getVDSOrderInfo(setFormInfo, setTariffsList))
  }, [])

  const handleTariffClick = (period, pricelist) => {
    if (selectedTariffId !== pricelist) {
      dispatch(vdsOperations.getTariffParameters(period, pricelist, setParametersInfo))
      setSelectedTariffId(pricelist)
    }
  }

  const getOptionsList = fieldName => {
    const optionsList = formInfo.slist.find(elem => elem.$name === fieldName).val

    return optionsList
      .filter(el => el?.$)
      .map(({ $key, $ }) => ({
        value: $key,
        label: t($.trim(), { ns: 'dedicated_servers' }),
      }))
  }

  const translatePeriodText = sentence => {
    const labelArr = sentence.split('EUR ')

    return (
      labelArr[0] +
      'EUR ' +
      t(labelArr[1].replace(')', '')) +
      (sentence.includes(')') ? ')' : '')
    )
  }

  const getOptionsListExtended = fieldName => {
    const optionsList = parametersInfo.slist.find(elem => elem.$name === fieldName)?.val

    return optionsList
      ?.filter(el => el?.$)
      ?.map(({ $key, $ }) => {
        let label = ''

        if ($.includes('EUR ')) {
          label = translatePeriodText($.trim())
        } else {
          label = t($.trim())
        }
        return { value: $key, label: label }
      })
  }

  const getControlPanelList = fieldName => {
    const optionsList = parametersInfo.slist.find(elem => elem.$name === fieldName)?.val

    return optionsList?.map(({ $key, $ }) => {
      let label = translatePeriodText($.trim())

      label = t(label.split(' (')[0]) + ' (' + label.split(' (')[1]
      return { value: $key, label: label }
    })
  }

  const translate = string => {
    return string.split('EUR ')[0] + 'EUR ' + t(string.split('EUR ')[1])
  }

  const parseTariffPrice = price => {
    let percent = price.match(/<b>(.+?)(?=<\/b>)/g)[0].replace('<b>', '')
    let newPrice = price.match(/<b>(.+?)(?=<\/b>)/g)[1].replace('<b>', '')
    let oldPrice = price.match(/<del>(.+?)(?=<\/del>)/g)[0].replace('<del>', '')

    newPrice = translate(newPrice)
    oldPrice = translate(oldPrice)

    return { percent, oldPrice, newPrice }
  }

  const renderSoftwareOSFields = (fieldName, values, setFieldValue, state, ostempl) => {
    let dataArr = parametersInfo.slist.find(el => el.$name === fieldName).val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software') }]
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
                setRecipe('null')
                parametersInfo[fieldName].$ = value
                setParametersInfo({ ...parametersInfo })
              } else {
                setRecipe(value)
              }

              if (value.includes('vestacp')) {
                onChangeField(
                  period,
                  { ...values, recipe: value, Control_panel: '97' },
                  'Control_panel',
                )
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
              if (fieldName === 'ostempl') {
                setRecipe('null')
                parametersInfo[fieldName].$ = value
                setParametersInfo({ ...parametersInfo })
              } else {
                setRecipe(value)
              }
            }}
          />
        )
      }
    })
  }

  const onChangeField = (period, values, fieldName) => {
    dispatch(
      vdsOperations.changeOrderFormField(
        period,
        values,
        recipe,
        selectedTariffId,
        parametersInfo.register[fieldName] || fieldName,
        setParametersInfo,
        parametersInfo.register,
      ),
    )
  }

  const onFormSubmit = values => {
    dispatch(
      vdsOperations.setOrderData(
        period,
        count,
        recipe,
        values,
        selectedTariffId,
        parametersInfo.register,
      ),
    )
  }

  const validationSchema = Yup.object().shape({
    agreement: Yup.string().oneOf(
      ['on'],
      t('agreement_warning', { ns: 'dedicated_servers' }),
    ),
    domain: Yup.string().matches(DOMAIN_REGEX, t('warning_domain')),
  })

  const totalPrice = +parametersInfo?.orderinfo?.$.match(/Total amount: (.+?)(?= EUR)/)[1]

  const getPortSpeed = () => {
    const temp = parametersInfo?.slist?.find(el => el.$name === 'Port_speed')?.val
    const value = Array.isArray(temp) ? temp?.[0].$ : temp?.$
    return value ? value : ''
  }

  const openTermsHandler = () => {
    dispatch(dnsOperations?.getPrintLicense(parametersInfo?.pricelist?.$))
  }

  return (
    <div className={s.pb}>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className={s.page_title}>{t('vds_order', { ns: 'crumbs' })} </h2>

      <ul className={s.categories_list}>
        {formInfo?.flist.val.map(({ $key, $ }) => {
          return (
            <li
              className={cn(s.category_item, { [s.selected]: tariffCategory === $key })}
              key={$key}
            >
              <button
                className={cn(s.category_btn, { [s.selected]: tariffCategory === $key })}
                type="button"
                onClick={() => setTariffCategory($key)}
              >
                {t($)}
              </button>
            </li>
          )
        })}
      </ul>

      <p className={s.section_title}>{t('tariffs')}</p>
      {formInfo && (
        <Formik
          enableReinitialize
          initialValues={{
            ostempl: parametersInfo?.ostempl?.$ || '',
            autoprolong: parametersInfo?.autoprolong?.$ || '',
            domain: parametersInfo?.domain?.$ || '',
            CPU_count: parametersInfo?.CPU_count || '',
            Memory: parametersInfo?.Memory || '',
            Disk_space: parametersInfo?.Disk_space || '',
            Port_speed: getPortSpeed(),
            Control_panel: parametersInfo?.Control_panel || '',
            IP_addresses_count: parametersInfo?.IP_addresses_count || '',
            agreement: checkboxEl.current?.checked ? 'on' : 'off',
            totalPrice: totalPrice,
            finalTotalPrice: +(totalPrice * count).toFixed(4),
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => {
            return (
              <Form>
                <Select
                  className={s.period_select}
                  inputClassName={s.select_bgc}
                  label={`${t('payment_period', { ns: 'dedicated_servers' })}:`}
                  itemsList={getOptionsList('period')}
                  value={period}
                  getElement={period => {
                    setPeriod(period)
                    dispatch(vdsOperations.getNewPeriodInfo(period, setTariffsList))
                    if (selectedTariffId) {
                      dispatch(
                        vdsOperations.getTariffParameters(
                          period,
                          selectedTariffId,
                          setParametersInfo,
                        ),
                      )
                    }
                  }}
                  isShadow
                />

                <ul className={s.tariffs_list}>
                  {filteredList.map(({ desc, pricelist, price }) => {
                    let parsedPrice
                    if (price.$.includes('<')) {
                      parsedPrice = parseTariffPrice(price.$)
                    }
                    return (
                      <li
                        className={cn(s.tariff_item, {
                          [s.selected]: selectedTariffId === pricelist.$,
                        })}
                        key={pricelist.$}
                      >
                        <div
                          className={s.tariff_btn}
                          tabIndex={0}
                          onKeyUp={null}
                          role="button"
                          onClick={() => handleTariffClick(period, pricelist.$)}
                        >
                          <span className={s.tariff_name}>{desc.$}</span>
                          {parsedPrice ? (
                            <>
                              <span className={s.old_price}>
                                <span className={s.percent}>{parsedPrice.percent} </span>
                                {parsedPrice.oldPrice}
                              </span>
                              <span className={s.new_price}>{parsedPrice.newPrice}</span>
                            </>
                          ) : (
                            translate(price.$)
                          )}
                          {!widerThanMobile && selectedTariffId === pricelist.$ && (
                            <div className={s.increment_wrapper}>
                              <button
                                className={cn(s.count_btn, s.decrement)}
                                type="button"
                                onClick={() => {
                                  setCount(+count - 1)
                                  setFieldValue(
                                    'finalTotalPrice',
                                    +(values.totalPrice * (+count - 1)).toFixed(4),
                                  )
                                }}
                                disabled={+count <= 1}
                              ></button>
                              <div className={s.input_wrapper}>
                                <input
                                  className={s.count_input}
                                  value={count}
                                  onChange={event => {
                                    setCount(
                                      +event.target.value > 50 ? 50 : event.target.value,
                                    )
                                  }}
                                  onBlur={event => {
                                    if (event.target.value < 1) setCount(1)
                                  }}
                                  type="number"
                                  min={1}
                                  max={50}
                                />
                              </div>
                              <button
                                className={cn(s.count_btn, s.increment)}
                                type="button"
                                onClick={() => {
                                  setCount(+count + 1)
                                  setFieldValue(
                                    'finalTotalPrice',
                                    +(values.totalPrice * (+count + 1)).toFixed(4),
                                  )
                                }}
                                disabled={+count >= 50}
                              ></button>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {parametersInfo && (
                  <>
                    <p className={s.section_title}>
                      {t('os', { ns: 'dedicated_servers' })}
                    </p>
                    <div className={s.software_OS_List}>
                      {renderSoftwareOSFields(
                        'ostempl',
                        values,
                        setFieldValue,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.section_title}>
                      {t('recipe', { ns: 'dedicated_servers' })}
                    </p>
                    <div className={s.software_OS_List}>
                      {renderSoftwareOSFields(
                        'recipe',
                        values,
                        setFieldValue,
                        recipe,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.section_title}>{t('characteristics')}</p>
                    <div className={s.parameters_list}>
                      <Select
                        value={values.Control_panel}
                        itemsList={getControlPanelList('Control_panel')}
                        getElement={value => {
                          setFieldValue('Control_panel', value)
                          onChangeField(
                            period,
                            { ...values, Control_panel: value },
                            'Control_panel',
                          )
                        }}
                        label={`${t('license_to_panel')}:`}
                        isShadow
                      />
                      <Select
                        itemsList={getOptionsListExtended('Memory')}
                        value={values.Memory}
                        label={`${t('memory')}:`}
                        getElement={value => {
                          setFieldValue('Memory', value)

                          onChangeField(period, { ...values, Memory: value }, 'Memory')
                        }}
                        isShadow
                      />
                      <Select
                        value={values.Disk_space}
                        itemsList={getOptionsListExtended('Disk_space')}
                        getElement={value => {
                          setFieldValue('Disk_space', value)

                          onChangeField(
                            period,
                            { ...values, Disk_space: value },
                            'Disk_space',
                          )
                        }}
                        label={`${t('disk_space')}:`}
                        isShadow
                      />
                      <Select
                        value={values.CPU_count}
                        itemsList={getOptionsListExtended('CPU_count')}
                        getElement={value => {
                          setFieldValue('CPU_count', value)
                          onChangeField(
                            period,
                            { ...values, CPU_count: value },
                            'CPU_count',
                          )
                        }}
                        label={`${t('processors')}:`}
                        isShadow
                      />
                      <InputField
                        name="Port_speed"
                        label={`${t('port_speed')}:`}
                        isShadow
                        disabled
                      />
                      {values.autoprolong && (
                        <Select
                          value={values.autoprolong}
                          itemsList={getOptionsListExtended('autoprolong')}
                          getElement={value => {
                            setFieldValue('autoprolong', value)
                          }}
                          label={`${t('autoprolong')}:`}
                          isShadow
                        />
                      )}
                      <InputField
                        name="domain"
                        label={`${t('domain_name', { ns: 'dedicated_servers' })}:`}
                        placeholder={t('domain_placeholder', { ns: 'dedicated_servers' })}
                        error={!!errors.domain}
                        touched={!!touched.domain}
                        isShadow
                      />
                      <InputField
                        name="IP_addresses_count"
                        label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                        isShadow
                        disabled
                      />
                    </div>

                    <div style={{ paddingBottom: '30px' }} ref={agreementEl}>
                      <div className={s.agreement_wrapper}>
                        <div className={s.checkbox_wrapper}>
                          <input
                            ref={checkboxEl}
                            className={cn(s.checkbox, {
                              [s.error]: errors.agreement && touched.agreement,
                            })}
                            type="checkbox"
                            onClick={() =>
                              setFieldValue(
                                'agreement',
                                values.agreement === 'on' ? 'off' : 'on',
                              )
                            }
                          />
                          {values.agreement === 'on' && (
                            <Check className={s.icon_check} />
                          )}
                        </div>

                        <p className={s.agreement_text}>
                          {t('terms', { ns: 'dedicated_servers' })}{' '}
                          <button className={s.link} onClick={openTermsHandler}>
                            &quot;{t('terms_2', { ns: 'dedicated_servers' })}&quot;
                          </button>
                        </p>
                      </div>
                      <ErrorMessage
                        className={s.error_message}
                        name="agreement"
                        component="p"
                      />
                    </div>
                  </>
                )}

                <div className={cn(s.buying_panel, { [s.opened]: parametersInfo })}>
                  {widerThanMobile && (
                    <div className={s.buying_panel_item}>
                      <p>{t('amount')}:</p>

                      <div className={s.increment_wrapper}>
                        <button
                          className={cn(s.count_btn, s.decrement)}
                          type="button"
                          onClick={() => {
                            setCount(+count - 1)
                            setFieldValue(
                              'finalTotalPrice',
                              +(values.totalPrice * (+count - 1)).toFixed(4),
                            )
                          }}
                          disabled={+count <= 1}
                        ></button>
                        <div className={s.input_wrapper}>
                          <input
                            className={cn(s.count_input, s.amount_digit)}
                            value={count}
                            onChange={event => {
                              setCount(+event.target.value > 50 ? 50 : event.target.value)
                            }}
                            onBlur={event => {
                              if (event.target.value < 1) setCount(1)
                            }}
                            type="number"
                            min={1}
                            max={50}
                          />
                        </div>
                        <button
                          className={cn(s.count_btn, s.increment)}
                          type="button"
                          onClick={() => {
                            setCount(+count + 1)
                            setFieldValue(
                              'finalTotalPrice',
                              +(values.totalPrice * (+count + 1)).toFixed(4),
                            )
                          }}
                          disabled={+count >= 50}
                        ></button>
                      </div>
                    </div>
                  )}

                  {widerThanMobile ? (
                    <p className={s.buying_panel_item}>
                      {t('topay', { ns: 'dedicated_servers' })}:
                      <span className={s.tablet_price_sentence}>
                        <span className={s.tablet_price}>
                          {values.finalTotalPrice} EUR
                        </span>{' '}
                        {t(parametersInfo?.orderinfo.$.match(/EUR (.+?)(?= <br\/>)/)[1])}
                      </span>
                    </p>
                  ) : (
                    <p className={s.price_wrapper}>
                      <span className={s.price}>€{values.finalTotalPrice}</span>
                      {t(parametersInfo?.orderinfo.$.match(/EUR (.+?)(?= <br\/>)/)[1])}
                    </p>
                  )}

                  <Button
                    className={s.btn_buy}
                    label={t('buy', { ns: 'other' })}
                    type="submit"
                    isShadow
                    onClick={() => {
                      values.agreement === 'off' &&
                        agreementEl.current.scrollIntoView({
                          behavior: 'smooth',
                        })
                    }}
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      )}
    </div>
  )
}