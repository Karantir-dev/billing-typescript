// import { useEffect, useState } from 'react'
// import { Form, Formik } from 'formik'
// import { useDispatch } from 'react-redux'
// import { useMediaQuery } from 'react-responsive'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { Trans, useTranslation } from 'react-i18next'
import {
  BreadCrumbs,
  // Select,
  // InputField,
  // SoftwareOSBtn,
  // SoftwareOSSelect,
  Button,
  // Icon,
  FixedFooter,
  Loader,
} from '@components'
// import { userOperations, vdsOperations } from '@redux'
import {
  //   DOMAIN_REGEX,
  //   getPortSpeed,
  //   translatePeriodName,
  //   translatePeriodText,
  useCancelRequest,
  //   useScrollToElement,
  //   roundToDecimal,
} from '@utils'
// import cn from 'classnames'
// import * as Yup from 'yup'
// import { VDS_IDS_LIKE_DEDICS } from '@utils/constants'

import s from './VDSOrder.module.scss'

// const MAX_ORDER_COUNT = 35

export default function VDSOrder() {
  const location = useLocation()
  // const dispatch = useDispatch()
  // const widerThanMobile = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation([
    'vds',
    'other',
    'crumbs',
    'dedicated_servers',
    'autoprolong',
  ])
  // const agreementEl = useRef()

  const { isLoading } = useCancelRequest()

  const navigate = useNavigate()

  const navigateToCloud = type => navigate(`${route.CLOUD_VPS_CREATE_INSTANCE}/${type}`)

  // const [formInfo, setFormInfo] = useState(null)
  // const [period, setPeriod] = useState('1')
  // const [tariffsList, setTariffsList] = useState([])
  // const [tariffCategory, setTariffCategory] = useState()
  // const [selectedTariffId, setSelectedTariffId] = useState()
  // const [parametersInfo, setParametersInfo] = useState()
  // const [count, setCount] = useState(1)
  // const [domainName, setDomainName] = useState('')

  // const [dataFromSite, setDataFromSite] = useState(null)

  // const [recipe, setRecipe] = useState('null')
  // const filteredList = tariffsList
  //   .filter(el => (tariffCategory ? el?.filter?.tag?.$ === tariffCategory : true))
  //   .filter(el => !VDS_IDS_LIKE_DEDICS.includes(el.pricelist.$))
  // const [scrollElem, runScroll] = useScrollToElement({ condition: parametersInfo })

  // useEffect(() => {
  //   const isInList = filteredList.some(el => el.pricelist.$ === selectedTariffId)
  //   if (!isInList && selectedTariffId) {
  //     setSelectedTariffId(null)
  //     setParametersInfo(null)
  //     setCount(1)
  //   }
  // }, [tariffCategory])

  // useEffect(() => {
  //   dispatch(
  //     vdsOperations.getVDSOrderInfo(setFormInfo, setTariffsList, signal, setIsLoading),
  //   )
  // }, [])

  // useEffect(() => {
  //   const cartFromSite = localStorage.getItem('site_cart')
  //   const cartFromSiteJson = JSON.parse(cartFromSite)
  //   if (formInfo && tariffsList && cartFromSiteJson) {
  //     setPeriod(cartFromSiteJson?.period)
  //     handleTariffClick(cartFromSiteJson?.period, cartFromSiteJson?.pricelist)
  //     setRecipe(cartFromSiteJson?.recipe)
  //     setCount(Number(cartFromSiteJson?.order_count))
  //     setDataFromSite({
  //       recipe: cartFromSiteJson?.recipe,
  //       ostempl: cartFromSiteJson?.ostempl,
  //       domain: cartFromSiteJson?.domain,
  //       CPU_count: cartFromSiteJson?.CPUcount,
  //       Memory: cartFromSiteJson?.Memory,
  //       Disk_space: cartFromSiteJson?.Diskspace,
  //       Port_speed: cartFromSiteJson?.Portspeed,
  //       Control_panel: cartFromSiteJson?.Controlpanel,
  //       autoprolong: cartFromSiteJson?.autoprolong,
  //     })
  //     localStorage.removeItem('site_cart')
  //   }
  // }, [formInfo, tariffsList])

  // const handleTariffClick = (period, pricelist) => {
  //   if (selectedTariffId !== pricelist) {
  //     dispatch(
  //       vdsOperations.getTariffParameters(
  //         period,
  //         pricelist,
  //         setParametersInfo,
  //         signal,
  //         setIsLoading,
  //       ),
  //     )
  //     setSelectedTariffId(pricelist)
  //   }
  // }

  // const getOptionsList = fieldName => {
  //   const optionsList = formInfo.slist.find(elem => elem.$name === fieldName).val

  //   return optionsList
  //     .filter(el => el?.$)
  //     .map(({ $key, $ }) => ({
  //       value: $key,
  //       label: t($.trim(), { ns: 'dedicated_servers' }),
  //     }))
  // }

  // const getOptionsListExtended = fieldName => {
  //   if (parametersInfo && parametersInfo.slist) {
  //     const optionsList = parametersInfo.slist.find(elem => elem.$name === fieldName)?.val

  //     let firstItem = 0

  //     return optionsList
  //       ?.filter(el => el?.$)
  //       ?.map(({ $key, $, $cost }, index) => {
  //         let label = ''
  //         let withSale = false
  //         let words = []

  //         if (fieldName === 'Memory') {
  //           words = $?.match(/[\d|.|\\+]+/g)

  //           if (words?.length > 0 && index === 0) {
  //             firstItem = words[0]
  //           }

  //           if (words?.length > 0 && Number(words[0]) === firstItem * 2) {
  //             withSale = true
  //           }
  //         }

  //         if (withSale && words?.length > 0) {
  //           label = (
  //             <span className={s.selectWithSale}>
  //               <div className={s.sale55Icon}>-55%</div>
  //               <span className={s.saleSpan}>
  //                 {`${words[0]} Gb (`}
  //                 <span className={s.memorySale}>
  //                   {roundToDecimal(Number($cost / 0.45))}
  //                 </span>
  //                 {translatePeriodText($.trim().split('(')[1], t)}
  //               </span>
  //             </span>
  //           )
  //         } else if (fieldName === 'Memory' || $.includes('EUR ')) {
  //           label = translatePeriodText($.trim(), t)
  //         } else {
  //           label = t($.trim())
  //         }
  //         return {
  //           value: $key,
  //           label: label,
  //           sale: withSale,
  //           newPrice: roundToDecimal(Number($cost)),
  //           oldPrice: roundToDecimal(Number($cost) + $cost * 0.55),
  //         }
  //       })
  //   }
  //   return []
  // }

  // const getControlPanelList = fieldName => {
  //   const optionsList = parametersInfo.slist.find(elem => elem.$name === fieldName)?.val

  //   return optionsList?.map(({ $key, $ }) => {
  //     let label = translatePeriodText($.trim(), t)

  //     label = t(label?.split(' (')[0]) + ' (' + label?.split(' (')[1]
  //     return { value: $key, label: label }
  //   })
  // }

  // const translate = string => {
  //   return (
  //     roundToDecimal(string?.split('EUR ')[0]) + ' EUR ' + t(string?.split('EUR ')[1])
  //   )
  // }

  // const parseTariffPrice = price => {
  //   let percent = price.match(/<b>(.+?)(?=<\/b>)/g)[0]?.replace('<b>', '')
  //   let newPrice = price.match(/<b>(.+?)(?=<\/b>)/g)[1]?.replace('<b>', '')
  //   let oldPrice = price.match(/<del>(.+?)(?=<\/del>)/g)[0]?.replace('<del>', '')

  //   newPrice = translate(newPrice)
  //   oldPrice = translate(oldPrice)

  //   return { percent, oldPrice, newPrice }
  // }

  // const renderSoftwareOSFields = (fieldName, setFieldValue, state, ostempl) => {
  //   let dataArr = parametersInfo.slist.find(el => el.$name === fieldName)?.val
  //   const elemsData = {}
  //   if (fieldName === 'recipe') {
  //     dataArr = dataArr?.filter(el => el.$depend === ostempl && el.$key !== 'null')
  //     elemsData.null = [{ $key: 'null', $: t('without_software') }]
  //   }

  //   dataArr?.forEach(element => {
  //     const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

  //     if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
  //       elemsData[itemName] = [element]
  //     } else {
  //       elemsData[itemName].push(element)
  //     }
  //   })

  //   return Object.entries(elemsData).map(([name, el]) => {
  //     if (el.length > 1) {
  //       const optionsList = el.map(({ $key, $ }) => ({
  //         value: $key,
  //         label: $,
  //       }))

  //       return (
  //         <SoftwareOSSelect
  //           key={optionsList[0].value}
  //           iconName={name.toLowerCase()}
  //           itemsList={optionsList}
  //           state={state}
  //           getElement={value => {
  //             setFieldValue(fieldName, value)
  //             if (fieldName === 'ostempl') {
  //               setRecipe('null')
  //               parametersInfo[fieldName].$ = value
  //               setParametersInfo({ ...parametersInfo })
  //             } else {
  //               setRecipe(value)
  //             }
  //           }}
  //         />
  //       )
  //     } else {
  //       return (
  //         <SoftwareOSBtn
  //           key={el[0].$key}
  //           value={el[0].$key}
  //           state={state}
  //           iconName={name.toLowerCase()}
  //           label={el[0].$}
  //           onClick={value => {
  //             if (fieldName === 'ostempl') {
  //               setRecipe('null')
  //               parametersInfo[fieldName].$ = value
  //               setParametersInfo({ ...parametersInfo })
  //             } else {
  //               setRecipe(value)
  //             }
  //           }}
  //         />
  //       )
  //     }
  //   })
  // }

  // const onChangeField = (period, values, fieldName) => {
  //   dispatch(
  //     vdsOperations.changeOrderFormField(
  //       period,
  //       values,
  //       recipe,
  //       selectedTariffId,
  //       parametersInfo.register[fieldName] || fieldName,
  //       setParametersInfo,
  //       parametersInfo.register,
  //       signal,
  //       setIsLoading,
  //     ),
  //   )
  // }

  // const onFormSubmit = values => {
  //   const saleMemory = getOptionsListExtended('Memory')?.find(
  //     e => e?.value === values.Memory,
  //   ).sale

  //   dispatch(
  //     userOperations.cleanBsketHandler(() =>
  //       dispatch(
  //         vdsOperations.setOrderData(
  //           period,
  //           count,
  //           recipe,
  //           values,
  //           selectedTariffId,
  //           parametersInfo.register,
  //           saleMemory,
  //         ),
  //       ),
  //     ),
  //   )
  // }

  // const validationSchema = Yup.object().shape({
  //   agreement: Yup.string().oneOf(
  //     ['on'],
  //     t('agreement_warning', { ns: 'dedicated_servers' }),
  //   ),
  //   domain: Yup.string().matches(DOMAIN_REGEX, t('warning_domain')),
  // })

  // const totalPrice = +parametersInfo?.orderinfo?.$?.match(
  //   /Total amount: (.+?)(?= EUR)/,
  // )[1]

  // const openTermsHandler = () => {
  //   dispatch(dnsOperations?.getPrintLicense(parametersInfo?.pricelist?.$))
  // }

  // const handleDomainChange = e => setDomainName(e.target.value)

  return (
    <div className={s.pb}>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className={s.page_title}>{t('vps_ordering_title')} </h2>

      <div className={s.description_wrapper}>
        <p className={s.description_text}>{t('vps_new_tariffs')}</p>
        <p className={s.description_headline}>{t('why_cloud_better')}</p>
        <ul className={s.description_list}>
          <li className={s.description_list_item}>
            <Trans
              t={t}
              i18nKey="cloud_unmatched_performance"
              components={{
                span: <span></span>,
              }}
            >
              <span>Неперевершена продуктивність:</span> Завдяки процесорам Xeon Gold,
              NVMe дискам та каналу 1 Гбит/с ваш сайт або веб-застосунок працюватиме
              блискавично, без затримок та збоїв.
            </Trans>
          </li>
          <li className={s.description_list_item}>
            <Trans
              t={t}
              i18nKey="cloud_scalability"
              components={{
                span: <span></span>,
              }}
            >
              <span>Масштабованість:</span> З Cloud VPS ви можете легко розширювати
              ресурси сервера в міру зростання ваших потреб.
            </Trans>
          </li>
          <li className={s.description_list_item}>
            <Trans
              t={t}
              i18nKey="cloud_reliability"
              components={{
                span: <span></span>,
              }}
            >
              <span>Надійність:</span> Наша хмарна інфраструктура гарантує безперебійну
              роботу вашого серверу 24/7.
            </Trans>
          </li>
          <li className={s.description_list_item}>
            <Trans
              t={t}
              i18nKey="cloud_flexibility"
              components={{
                span: <span></span>,
              }}
            >
              <span>Гнучкість:</span> Завдяки гнучким конфігураціям Cloud VPS ви можете
              вибрати сервер, який ідеально відповідає вашим потребам та бюджету.
            </Trans>
          </li>
        </ul>
        <p className={s.description_headline}>{t('outdated_vps')}</p>
        <p className={s.description_text}>{t('outdated_vps_descr')}</p>
        <p className={s.description_headline}>
          <Trans
            t={t}
            i18nKey="cloud_in_two_types"
            components={{
              span: <span className={s.description_category}></span>,
            }}
          >
            Cloud VPS доступний у двох типах тарифів:{' '}
            <span className={s.description_category}>Premium</span> та{' '}
            <span className={s.description_category}>Basic</span>.
          </Trans>
        </p>
        <p className={s.description_category}>Premium:</p>

        <ul className={s.sublist}>
          <li className={s.description_list_item}>
            <span>{t('performance_and_flexibility')}</span>
          </li>
          <li className={s.description_list_item}>
            <span>{t('includes')}:</span>
            <ul className={s.sublist}>
              <li className={s.sublist_item}>{t('powerful_processors')}</li>
              <li className={s.sublist_item}>{t('more_ram')}</li>
              <li className={s.sublist_item}>{t('more_disk_space')}</li>
              <li className={s.sublist_item}>{t('additional_features')}</li>
            </ul>
          </li>
        </ul>

        <p className={s.description_category}>Basic:</p>
        <ul className={s.sublist}>
          <li className={s.description_list_item}>
            <span>{t('affordable_and_reliable')}</span>
          </li>
          <li className={s.description_list_item}>
            <span>{t('includes')}:</span>
            <ul className={s.sublist}>
              <li className={s.sublist_item}>{t('enough_power_for_web')}</li>
              <li className={s.sublist_item}>{t('high_performance_and_reliability')}</li>
              <li className={s.sublist_item}>{t('affordable_price')}</li>
            </ul>
          </li>
        </ul>

        <p className={s.description_headline}>{t('switch_to_cloud')}</p>
        <p className={s.description_text}>{t('dont_miss_the_opportunity')}</p>
      </div>

      {/* <ul className={s.categories_list}>
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
      </ul> */}

      {/* <p className={s.section_title}>{t('tariffs')}</p>
      {formInfo && (
        <Formik
          enableReinitialize
          initialValues={{
            ostempl: dataFromSite?.ostempl || parametersInfo?.ostempl?.$ || '',
            autoprolong:
              dataFromSite?.autoprolong || parametersInfo?.autoprolong?.$ || '',
            domain: dataFromSite?.domain || parametersInfo?.domain?.$ || '',
            CPU_count: dataFromSite?.CPU_count || parametersInfo?.CPU_count || '',
            Memory: dataFromSite?.Memory || parametersInfo?.Memory || '',
            Disk_space: dataFromSite?.Disk_space || parametersInfo?.Disk_space || '',
            Port_speed: getPortSpeed(parametersInfo),
            Control_panel:
              dataFromSite?.Control_panel || parametersInfo?.Control_panel || '',
            IP_addresses_count: parametersInfo?.IP_addresses_count || '',
            agreement: 'on', //checkboxEl.current?.checked ? 'on' : 'off',
            totalPrice: totalPrice,
            finalTotalPrice: roundToDecimal(+(totalPrice * count)),
            server_name:
              dataFromSite?.server_name || parametersInfo?.server_name?.$ || '',
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => {
            const checkSaleMemory = () => {
              // const item = getOptionsListExtended('Memory')?.find(
              //   e => e.value === values.Memory,
              // )

              // if (item?.sale) {
              //   return item?.oldPrice - item?.newPrice
              // }

              return 0
            }
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
                    dispatch(
                      vdsOperations.getNewPeriodInfo(
                        period,
                        setTariffsList,
                        signal,
                        setIsLoading,
                      ),
                    )
                    if (selectedTariffId) {
                      dispatch(
                        vdsOperations.getTariffParameters(
                          period,
                          selectedTariffId,
                          setParametersInfo,
                          signal,
                          setIsLoading,
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
                          onClick={() => {
                            handleTariffClick(period, pricelist.$)
                            setRecipe('null')
                            runScroll()
                          }}
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
                                    roundToDecimal(+(values.totalPrice * (+count - 1))),
                                  )
                                }}
                                disabled={+count <= 1}
                              ></button>
                              <div className={s.input_wrapper_border}>
                                <div className={s.input_wrapper_bg}>
                                  <div className={s.input_wrapper}>
                                    <input
                                      className={s.count_input}
                                      value={count}
                                      onChange={event => {
                                        const value =
                                          event.target.value.length > 1
                                            ? event.target.value.replace(/^0/, '')
                                            : event.target.value

                                        setCount(
                                          +event.target.value > MAX_ORDER_COUNT
                                            ? MAX_ORDER_COUNT
                                            : value,
                                        )
                                      }}
                                      onBlur={event => {
                                        if (event.target.value < 1) setCount(1)
                                      }}
                                      type="number"
                                      min={1}
                                      max={MAX_ORDER_COUNT}
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
                                disabled={+count >= MAX_ORDER_COUNT}
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
                    <p ref={scrollElem} className={s.section_title}>
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
                        recipe,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.section_title}>{t('characteristics')}</p>
                    <div className={s.parameters_list}>
                      <Select
                        itemsList={getOptionsListExtended('Memory')}
                        value={values.Memory}
                        saleIcon={
                          <Icon
                            name="SaleFiftyFive"
                            style={{ marginLeft: 7, position: 'absolute', top: -10 }}
                          />
                        }
                        label={`${t('memory')}:`}
                        getElement={value => {
                          setFieldValue('Memory', value)

                          onChangeField(period, { ...values, Memory: value }, 'Memory')
                        }}
                        isShadow
                      />

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

                            onChangeField(
                              period,
                              { ...values, autoprolong: value },
                              'autoprolong',
                            )
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
                        value={domainName}
                        onChange={handleDomainChange}
                      />

                      <InputField
                        label={`${t('server_name')}:`}
                        placeholder={`${t('server_placeholder')}`}
                        name="server_name"
                        isShadow
                        error={!!errors.server_name}
                        touched={!!touched.server_name}
                        className={s.input_field_wrapper}
                        inputClassName={s.text_area}
                        autoComplete="off"
                        type="text"
                        value={values?.server_name}
                      />

                      <InputField
                        name="IP_addresses_count"
                        label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                        isShadow
                        disabled
                      />
                    </div>
                  </>
                )}

                <div className={cn(s.buying_panel, { [s.opened]: parametersInfo })}>
                  {widerThanMobile && (
                    <div className={s.buying_panel_item}>
                      <p>{t('amount_servers')}:</p>

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

                                  setCount(
                                    +event.target.value > MAX_ORDER_COUNT
                                      ? MAX_ORDER_COUNT
                                      : value,
                                  )
                                }}
                                onBlur={event => {
                                  if (event.target.value < 1) setCount(1)
                                }}
                                type="number"
                                min={1}
                                max={MAX_ORDER_COUNT}
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
                          disabled={+count >= MAX_ORDER_COUNT}
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
                </div>
              </Form>
            )
          }}
        </Formik>
      )} */}
      <FixedFooter isShown={true}>
        <div className={s.redirect_btns_wrapper}>
          <Button
            className={s.buy_btn}
            type="button"
            isShadow
            textClassName={s.buy_btn_text}
            label={t('to_order', { ns: 'other' }) + ' Premium Cloud VPS'}
            onClick={() => {
              navigateToCloud('premium')
            }}
          />
          <Button
            className={s.buy_btn}
            type="button"
            isShadow
            textClassName={s.buy_btn_text}
            label={t('to_order', { ns: 'other' }) + ' Basic Cloud VPS'}
            onClick={() => {
              navigateToCloud('basic')
            }}
          />
        </div>
      </FixedFooter>
      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
