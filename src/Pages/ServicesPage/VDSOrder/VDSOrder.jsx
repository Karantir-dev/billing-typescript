import cn from 'classnames'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
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
} from '../../../Components'
import { Check } from '../../../images'
import { vdsOperations } from '../../../Redux'

import s from './VDSOrder.module.scss'

export default function VDSOrder() {
  const location = useLocation()
  const dispatch = useDispatch()
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation(['vds', 'other', 'crumbs', 'dedicated_servers'])

  const [formInfo, setFormInfo] = useState(null)
  const [period, setPeriod] = useState('1')
  const [tariffsList, setTariffsList] = useState([])
  const [tariffCategory, setTariffCategory] = useState()
  const [selectedTariffId, setSelectedTariffId] = useState()
  const [parametersInfo, setParametersInfo] = useState()

  useEffect(() => {
    dispatch(vdsOperations.getVDSOrderInfo(setFormInfo, setTariffsList))
  }, [])

  const handleTariffClick = (period, pricelist) => {
    if (selectedTariffId !== pricelist) {
      dispatch(vdsOperations.getTariffParameters(period, pricelist, setParametersInfo))
      setSelectedTariffId(pricelist)
    }
  }

  const mutateOptionsListData = (list, orderinfo, fieldForChange, value) => {
    parametersInfo.slist.forEach(el => {
      if (el.$name === 'autoprolong') {
        el.val = list
      }
    })
    parametersInfo.orderinfo.$ = orderinfo
    parametersInfo[fieldForChange] = value
    setParametersInfo({ ...parametersInfo })
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
    let percent = price.match(/(?<=<b>)(.+?)(?=<\/b>)/g)[0]
    let newPrice = price.match(/(?<=<b>)(.+?)(?=<\/b>)/g)[1]
    let oldPrice = price.match(/(?<=<del>)(.+?)(?=<\/del>)/g)[0]

    newPrice = translate(newPrice)
    oldPrice = translate(oldPrice)

    return { percent, oldPrice, newPrice }
  }

  const renderSoftwareOSFields = (fieldName, setFieldValue, state, ostempl) => {
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
              if (fieldName === 'ostempl') parametersInfo.recipe.$ = 'null'
              parametersInfo[fieldName].$ = value
              setParametersInfo({ ...parametersInfo })
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
              if (fieldName === 'ostempl') parametersInfo.recipe.$ = 'null'

              parametersInfo[fieldName].$ = value

              setParametersInfo({ ...parametersInfo })
            }}
          />
        )
      }
    })
  }

  const onChangeField = (period, value, fieldName) => {
    dispatch(
      vdsOperations.changeOrderFormField(
        period,
        value,
        selectedTariffId,
        parametersInfo.register[fieldName],
        (list, orderinfo) => mutateOptionsListData(list, orderinfo, fieldName, value),
      ),
    )
  }

  const validationSchema = Yup.object().shape({
    agreement: Yup.string().oneOf(
      ['on'],
      t('agreement_warning', { ns: 'dedicated_servers' }),
    ),
  })

  return (
    <div>
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
                {$}
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
            recipe: parametersInfo?.recipe?.$ || '',
            CPU_count: parametersInfo?.CPU_count || '',
            Memory: parametersInfo?.Memory || '',
            Disk_space: parametersInfo?.Disk_space || '',
            Port_speed:
              parametersInfo?.slist.find(el => el.$name === 'Port_speed').val[0].$ || '',
            Control_panel: parametersInfo?.Control_panel || '',
            IP_addresses_count: parametersInfo?.IP_addresses_count || '',
            agreement: 'off',
            totalPrice: Number(
              parametersInfo?.orderinfo.$.match(/(?<=Total amount: )(.+?)(?= EUR)/g),
            ),
            finalTotalPrice: parametersInfo?.orderinfo.$.match(
              /(?<=Total amount: )(.+?)(?= EUR)/g,
            ),
            count: 1,
          }}
          validationSchema={validationSchema}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors }) => {
            console.log(values)
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
                  {tariffsList
                    .filter(el =>
                      tariffCategory ? el.filter.tag.$ === tariffCategory : true,
                    )
                    .map(({ desc, pricelist, price }) => {
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
                                  <span className={s.percent}>
                                    {parsedPrice.percent}{' '}
                                  </span>
                                  {parsedPrice.oldPrice}
                                </span>
                                <span className={s.new_price}>
                                  {parsedPrice.newPrice}
                                </span>
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
                                    setFieldValue('count', values.count - 1)
                                    setFieldValue(
                                      'finalTotalPrice',
                                      values.totalPrice * (values.count - 1),
                                    )
                                  }}
                                  disabled={values.count === 1}
                                ></button>
                                <span>{values.count}</span>
                                <button
                                  className={cn(s.count_btn, s.increment)}
                                  type="button"
                                  onClick={() => {
                                    setFieldValue('count', values.count + 1)
                                    setFieldValue(
                                      'finalTotalPrice',
                                      values.totalPrice * (values.count + 1),
                                    )
                                  }}
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
                      {renderSoftwareOSFields('ostempl', setFieldValue, values.ostempl)}
                    </div>

                    <p className={s.section_title}>
                      {t('recipe', { ns: 'dedicated_servers' })}
                    </p>
                    <div className={s.software_OS_List}>
                      {renderSoftwareOSFields(
                        'recipe',
                        setFieldValue,
                        values.recipe,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.section_title}>{t('characteristics')}</p>
                    <div className={s.parameters_list}>
                      <Select
                        itemsList={getOptionsListExtended('Memory')}
                        value={values.Memory}
                        label={`${t('memory')}:`}
                        getElement={value => {
                          setFieldValue('Memory', value)
                          onChangeField(period, value, 'Memory')
                        }}
                        isShadow
                      />
                      <Select
                        value={values.Disk_space}
                        itemsList={getOptionsListExtended('Disk_space')}
                        getElement={value => {
                          setFieldValue('Disk_space', value)
                          onChangeField(period, value, 'Disk_space')
                        }}
                        label={`${t('disk_space')}:`}
                        isShadow
                      />
                      <Select
                        value={values.CPU_count}
                        itemsList={getOptionsListExtended('CPU_count')}
                        getElement={value => {
                          setFieldValue('CPU_count', value)
                          onChangeField(period, value, 'CPU_count')
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
                          getElement={value => setFieldValue('autoprolong', value)}
                          label={`${t('autoprolong')}:`}
                          isShadow
                        />
                      )}
                      <InputField
                        name="domain"
                        label={`${t('domain_name', { ns: 'dedicated_servers' })}:`}
                        placeholder={t('domain_placeholder', { ns: 'dedicated_servers' })}
                        isShadow
                      />
                      <InputField
                        name="IP_addresses_count"
                        label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                        isShadow
                        disabled
                      />
                      <Select
                        value={values.Control_panel}
                        itemsList={getControlPanelList('Control_panel')}
                        getElement={value => {
                          setFieldValue('Control_panel', value)
                          onChangeField(period, value, 'Control_panel')
                        }}
                        label={`${t('license_to_panel')}:`}
                        isShadow
                      />
                    </div>

                    <div className={s.agreement_wrapper}>
                      <div className={s.checkbox_wrapper}>
                        <input
                          className={cn(s.checkbox, { [s.error]: errors.agreement })}
                          type="checkbox"
                          onClick={() =>
                            setFieldValue(
                              'agreement',
                              values.agreement === 'on' ? 'off' : 'on',
                            )
                          }
                        />
                        {values.agreement === 'on' && <Check className={s.icon_check} />}
                      </div>

                      <p className={s.agreement_text}>
                        {t('terms', { ns: 'dedicated_servers' })}{' '}
                        <a className={s.link} href={parametersInfo.licence_link.$}>
                          &quot;{t('terms_2', { ns: 'dedicated_servers' })}&quot;
                        </a>
                      </p>
                    </div>
                    <ErrorMessage
                      className={s.error_message}
                      name="agreement"
                      component="p"
                    />
                  </>
                )}
                <div className={cn(s.buying_panel, { [s.opened]: parametersInfo })}>
                  {widerThanMobile ? (
                    <p className={s.tablet_price_wrapper}>
                      {t('topay', { ns: 'dedicated_servers' })}:
                      <span className={s.tablet_price_sentence}>
                        <span className={s.tablet_price}>
                          {values.finalTotalPrice} EUR
                        </span>{' '}
                        {t(
                          parametersInfo?.orderinfo.$.match(/(?<=EUR )(.+?)(?= <br\/>)/g),
                        )}
                      </span>
                    </p>
                  ) : (
                    <p className={s.price_wrapper}>
                      <span className={s.price}>€{values.finalTotalPrice}</span>
                      {t(parametersInfo?.orderinfo.$.match(/(?<=EUR )(.+?)(?= <br\/>)/g))}
                    </p>
                  )}
                  <Button
                    className={s.btn_buy}
                    label={t('buy', { ns: 'other' })}
                    type="submit"
                    isShadow
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
