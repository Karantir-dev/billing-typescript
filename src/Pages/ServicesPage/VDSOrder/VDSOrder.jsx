import cn from 'classnames'
import { Form, Formik } from 'formik'

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
} from '../../../Components'
import { vdsOperations } from '../../../Redux'

import s from './VDSOrder.module.scss'

export default function VDSOrder() {
  const location = useLocation()
  const dispatch = useDispatch()
  const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation(['vds', 'other', 'crumbs', 'dedicated_servers'])

  const [formInfo, setFormInfo] = useState(null)
  const [tariffsList, setTariffsList] = useState([])
  const [tariffCategory, setTariffCategory] = useState()
  const [selectedTariff, setSelectedTariff] = useState()
  const [parametersInfo, setParametersInfo] = useState()

  useEffect(() => {
    dispatch(vdsOperations.getVDSOrderInfo(setFormInfo, setTariffsList))
  }, [])

  const handleTariffClick = (period, pricelist) => {
    if (selectedTariff !== pricelist) {
      dispatch(vdsOperations.getTariffParameters(period, pricelist, setParametersInfo))
      setSelectedTariff(pricelist)
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
    const optionsList = parametersInfo.slist.find(elem => elem.$name === fieldName).val
    // if (fieldName === 'autoprolong' && !optionsList.find(el => el.$key === 'null')) {
    //   optionsList.unshift({ $key: 'null', $: 'Disabled' })
    // }

    return optionsList
      .filter(el => el?.$)
      .map(({ $key, $ }) => {
        let label = ''

        if ($.includes('EUR ')) {
          label = translatePeriodText($.trim())
        } else {
          label = t($.trim())
        }
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
            onClick={value => setFieldValue(fieldName, value)}
          />
        )
      }
    })
  }

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className={s.page_title}>{t('vds_order', { ns: 'crumbs' })}</h2>
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
            period: formInfo.period.$,
            ostempl: parametersInfo?.ostempl?.$,
            autoprolong: parametersInfo?.autoprolong?.$,
            domain: parametersInfo?.domain?.$,
            recipe: parametersInfo?.recipe?.$,
            CPU_count: parametersInfo?.CPU_count,
            Memory: parametersInfo?.Memory,
            Disk_space: parametersInfo?.Disk_space,
            Port_speed: parametersInfo?.Port_speed,
            Control_panel: parametersInfo?.Control_panel,
            IP_addresses_count: parametersInfo?.IP_addresses_count,
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <Select
                  className={s.period_select}
                  inputClassName={s.select_bgc}
                  label={`${t('payment_period', { ns: 'dedicated_servers' })}:`}
                  itemsList={getOptionsList('period')}
                  value={values.period}
                  getElement={period => {
                    setFieldValue('period', period)
                    dispatch(vdsOperations.getNewPeriodInfo(period, setTariffsList))
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
                            [s.selected]: selectedTariff === pricelist.$,
                          })}
                          key={pricelist.$}
                        >
                          <button
                            className={s.tariff_btn}
                            type="button"
                            onClick={() => handleTariffClick(values.period, pricelist.$)}
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
                            {!widerThanMobile && selectedTariff === pricelist.$ && (
                              <div>- tool + </div>
                            )}
                          </button>
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
                        label={t(`${t('memory')}:`)}
                        getElement={value => setFieldValue('Memory', value)}
                        isShadow
                      />
                      <Select
                        value={values.Disk_space}
                        itemsList={getOptionsListExtended('Disk_space')}
                        getElement={value => setFieldValue('Disk_space', value)}
                        label={t(`${t('disk_space')}:`)}
                        isShadow
                      />
                      <Select
                        value={values.CPU_count}
                        itemsList={getOptionsListExtended('CPU_count')}
                        getElement={value => setFieldValue('CPU_count', value)}
                        label={t(`${t('processors')}:`)}
                        isShadow
                      />
                      <InputField
                        name="Port_speed"
                        label={t(`${t('port_speed')}:`)}
                        isShadow
                      />
                      <Select
                        value={values.autoprolong}
                        itemsList={getOptionsListExtended('autoprolong')}
                        getElement={value => setFieldValue('autoprolong', value)}
                        label={t(`${t('autoprolong')}:`)}
                        isShadow
                      />
                    </div>
                  </>
                )}
              </Form>
            )
          }}
        </Formik>
      )}
    </div>
  )
}
