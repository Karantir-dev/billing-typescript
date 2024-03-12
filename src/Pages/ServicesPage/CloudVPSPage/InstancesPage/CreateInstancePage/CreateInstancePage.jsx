import {
  BreadCrumbs,
  Loader,
  SoftwareOSSelect,
  SoftwareOSBtn,
  CheckBox,
} from '@components'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { getFlagFromCountryName, useCancelRequest } from '@src/utils'
import cn from 'classnames'
import { Form, Formik } from 'formik'

import s from './CreateInstancePage.module.scss'
import { Infinity } from '@src/images'

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()

  const { t } = useTranslation([])

  const [dcList, setDcList] = useState()
  const [currentDC, setCurrentDC] = useState()
  const [osList, setOsList] = useState([])
  const [tariffsList, setTariffsList] = useState([])

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  useEffect(() => {
    dispatch(
      cloudVpsOperations.getCloudOrderPageInfo({
        signal,
        setIsLoading,
        setDcList,
        setOsList,
        setTariffsList,
      }),
    )
  }, [currentDC])

  const renderSoftwareOSFields = ({
    fieldName,
    value,
    // eslint-disable-next-line no-unused-vars
    ostempl,
    list,
    onOSchange,
    onRecipeChange,
    OSfieldName,
  }) => {
    // let dataArr = parametersInfo.slist.find(el => el.$name === fieldName)?.val

    const elemsData = {}
    // if (fieldName === 'recipe') {
    //   list = list?.filter(el => el.$depend === ostempl && el.$key !== 'null')
    //   elemsData.null = [{ $key: 'null', $: t('without_software') }]
    // }

    list?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
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
            iconName={name.toLowerCase()}
            itemsList={optionsList}
            state={value}
            getElement={value => {
              if (fieldName === OSfieldName) {
                onOSchange(value)
              } else {
                onRecipeChange(value)
              }
            }}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={value}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={value => {
              if (fieldName === OSfieldName) {
                onOSchange(value)
              } else {
                onRecipeChange(value)
              }
            }}
          />
        )
      }
    })
  }

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <section className={s.section}>
        <h3 className={s.section_title}>{t('server_location')}</h3>

        <ul className={s.categories_list}>
          {dcList?.map(({ $key, $ }) => {
            return (
              <li
                className={cn(s.category_item, { [s.selected]: currentDC === $key })}
                key={$key}
              >
                <button
                  className={cn(s.category_btn)}
                  type="button"
                  onClick={() => setCurrentDC($key)}
                >
                  <img
                    className={s.flag}
                    src={require(`@images/countryFlags/${getFlagFromCountryName(
                      $.replace('Fotbo ', ''),
                    )}.png`)}
                    width={20}
                    height={14}
                    alt={$.replace('Fotbo ', '')}
                  />
                  {t($)}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <Formik
        enableReinitialize
        initialValues={{
          instances_os: osList[0]?.$key || '',
          // autoprolong: parametersInfo?.autoprolong?.$ || '',
        }}
        // validationSchema={validationSchema}
        // onSubmit={onFormSubmit}
      >
        {({ values, setFieldValue }) => {
          const onOSchange = value => {
            setFieldValue('instances_os', value)
          }

          return (
            <Form>
              <section className={s.section}>
                <h3 className={s.section_title}>{t('server_image')}</h3>

                <div className={s.os_list}>
                  {renderSoftwareOSFields({
                    fieldName: 'instances_os',
                    list: osList,
                    value: values.instances_os,
                    onOSchange,
                    OSfieldName: 'instances_os',
                  })}
                </div>
              </section>

              <section className={s.section}>
                <h3 className={s.section_title}>{t('Server size')}</h3>

                <label className={s.ip_checkbox} htmlFor="ipv6">
                  <CheckBox id="ipv6" />
                  Enable only IPv6
                  <span className={s.ip_discount}>-1€</span>
                </label>

                <ul className={s.tariffs_list}>
                  {tariffsList.map(tariff => {
                    const cpu = tariff.detail.find(
                      el => el.name.$.toLowerCase() === 'cpu',
                    ).value.$
                    // const network = tariff.detail.find(el => el.name.$.toLowerCase() === 'network')
                    const memory = tariff.detail
                      .find(el => el.name.$.toLowerCase() === 'memory')
                      .value.$.replace('.', '')
                    const disk = tariff.detail
                      .find(el => el.name.$.toLowerCase() === 'disk space')
                      .value.$.replace('.', '')
                    return (
                      <li className={s.tariff_item} key={tariff.id.$}>
                        <button className={s.tariff_btn} type="button">
                          <p className={s.tariff_title}>{tariff.title.main.$}</p>
                          <div className={s.tariff_parameters}>
                            <div className={s.tariff_row}>
                              <span className={s.parameter_label}>CPU</span>
                              <span className={s.parameter_value}>{cpu}</span>
                            </div>
                            <div className={s.tariff_row}>
                              <span className={s.parameter_label}>RAM</span>
                              <span className={s.parameter_value}>{memory}</span>
                            </div>
                            <div className={s.tariff_row}>
                              <span className={s.parameter_label}>NVMe</span>
                              <span className={s.parameter_value}>{disk}</span>
                            </div>
                            <div className={s.tariff_row}>
                              <span className={s.parameter_label}>Speed</span>
                              <span className={s.parameter_value}>250 Mbps</span>
                            </div>
                            <div className={s.tariff_row}>
                              <span className={s.parameter_label}>Traffic</span>
                              <span className={s.parameter_value}>
                                <Infinity className={s.infinity} />
                              </span>
                            </div>
                          </div>
                          <p className={s.tariff_price}>123</p>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className={s.section}>
                <h3 className={s.section_title}>Choose Authentication Method</h3>
              </section>
              {/* <div className={cn(s.buying_panel, { [s.opened]: parametersInfo })}>
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
                              roundToDecimal(+(values.totalPrice * (+count - 1))),
                            )
                          }}
                          disabled={+count <= 1}
                        ></button>
                        <div className={s.input_wrapper_border}>
                          <div className={s.input_wrapper_bg}>
                            <div className={s.input_wrapper}>
                              <input
                                className={cn(s.count_input, s.amount_digit)}
                                value={count}
                                onChange={event => {
                                  const value =
                                    event.target.value.length > 1
                                      ? event.target.value?.replace(/^0/, '')
                                      : event.target.value

                                  setCount(+event.target.value > 35 ? 35 : value)
                                }}
                                onBlur={event => {
                                  if (event.target.value < 1) setCount(1)
                                }}
                                type="number"
                                min={1}
                                max={35}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          className={cn(s.count_btn, s.increment)}
                          type="button"
                          onClick={() => {
                            setCount(+count + 1)
                            setFieldValue(
                              'finalTotalPrice',
                              roundToDecimal(+(values.totalPrice * (+count + 1))),
                            )
                          }}
                          disabled={+count >= 35}
                        ></button>
                      </div>
                    </div>
                  )}

                  {widerThanMobile ? (
                    <p className={s.buying_panel_item}>
                      {t('topay', { ns: 'dedicated_servers' })}:
                      <span className={s.tablet_price_sentence}>
                        <span className={s.tablet_price}>
                          {roundToDecimal(values.finalTotalPrice - checkSaleMemory())} EUR
                        </span>
                        {` ${translatePeriodName(period, t)}`}
                      </span>
                    </p>
                  ) : (
                    <p className={s.price_wrapper}>
                      <span className={s.price}>
                        €{roundToDecimal(values.finalTotalPrice - checkSaleMemory())}
                      </span>
                      {` ${translatePeriodName(period, t)}`}
                      
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
                </div> */}
            </Form>
          )
        }}
      </Formik>

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
