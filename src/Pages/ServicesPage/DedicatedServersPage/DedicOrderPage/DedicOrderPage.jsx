import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BreadCrumbs,
  Button,
  SoftwareOSBtn,
  SoftwareOSSelect,
  Select,
  InputField,
  Icon,
  Loader,
} from '@components'
import DedicTarifCard from './DedicTarifCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import {
  dedicActions,
  dedicOperations,
  dedicSelectors,
  userOperations,
  vdsOperations,
} from '@redux'
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  checkIfTokenAlive,
  useScrollToElement,
  translatePeriod,
  useCancelRequest,
  translatePeriodText,
  getPortSpeed,
  roundToDecimal,
} from '@utils'
import * as route from '@src/routes'
import * as Yup from 'yup'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import s from './DedicOrderPage.module.scss'
import './DedicSwiper.scss'
import { VDS_IDS_TO_ORDER } from '@src/utils/constants'
import DedicFilter from './DedicFilter'

SwiperCore.use([EffectCoverflow, Pagination])

const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return { ...state, [action.key]: [...state[action.key], action.value] }
    case 'remove':
      return {
        ...state,
        [action.key]: state[action.key].filter(el => el !== action.value),
      }
    case 'update_filter':
      return action.value
    case 'clear_filter':
      return Object.keys(state).reduce((obj, el) => {
        obj[el] = []
        return obj
      }, {})
    default:
      return state
  }
}

export default function DedicOrderPage() {
  const dispatch = useDispatch()
  const licenceCheck = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  const isDedicOrderAllowed = location?.state?.isDedicOrderAllowed
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const vdsList = useSelector(dedicSelectors.getVDSList)
  const { t } = useTranslation(['dedicated_servers', 'other', 'vds', 'autoprolong'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const deskOrHigher = useMediaQuery({ query: '(min-width: 1549px)' })

  const [tarifList, setTarifList] = useState(tarifsList)
  const [parameters, setParameters] = useState(null)
  const [vdsParameters, setVdsParameters] = useState(null)
  const [selectedTariffId, setSelectedTariffId] = useState()
  const [price, setPrice] = useState('')
  const [dedicInfoList, setDedicInfoList] = useState([])

  const [filters, setFilters] = useReducer(reducer, {})

  useEffect(() => {
    const set = new Set()
    tarifsList.fpricelist
      ?.filter(el => el.$.includes(':'))
      ?.forEach(el => {
        set.add(el.$.split(':')[0])
      })

    const filterGroups = [...set].reduce((obj, el) => {
      obj[el] = []
      return obj
    }, {})

    setFilters({ type: 'update_filter', value: filterGroups })
  }, [tarifsList])

  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)
  const [dataFromSite, setDataFromSite] = useState(null)
  const [period, setPeriod] = useState('1')
  const [filteredTariffsList, setFilteredTariffsList] = useState([])

  const [scrollElem, runScroll] = useScrollToElement({
    condition: parameters || vdsParameters,
  })

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

    let amount = roundToDecimal(Number(amounts[amounts.length - 1]))
    let percent = Number(amounts[0]) + '%'
    let sale = roundToDecimal(Number(amounts[1])) + ' ' + 'EUR'

    setPeriodName(period)

    return {
      amount,
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

  // RENDER ALL SELECTS 'ostempl', setFieldValue, values.ostempl
  const renderSoftwareOSFields = (values, fieldName, setFieldValue, state, ostempl) => {
    if (isTarifChosen === 'vds') {
      return renderSoftwareOSFieldsVDS(values, fieldName, setFieldValue, state, ostempl)
    }
    let dataArr = parameters?.find(el => el.$name === fieldName)?.val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr?.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software', { ns: 'vds' }) }]
    }

    dataArr?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData)?.map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el?.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            iconName={name.toLowerCase()}
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
            iconName={name.toLowerCase()}
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

  //swiper
  const [swiperRef, setSwiperRef] = useState()
  const [isSwiperBeginning, setIsSwiperBeginning] = useState(true)
  const [isSwiperEnd, setIsSwiperEnd] = useState(false)

  const handleLeftClick = useCallback(() => {
    if (!swiperRef) return
    swiperRef.slidePrev()
    setIsSwiperBeginning(swiperRef.isBeginning)
    setIsSwiperEnd(swiperRef.isEnd)
  }, [swiperRef])

  const handleRightClick = useCallback(() => {
    if (!swiperRef) return
    swiperRef.slideNext()
    setIsSwiperBeginning(swiperRef.isBeginning)
    setIsSwiperEnd(swiperRef.isEnd)
  }, [swiperRef])

  useEffect(() => {
    const mainSwiper = document.querySelector('.swiper-wrapper')

    try {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (
              entry.boundingClientRect.left >= 0 &&
              entry.boundingClientRect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
            ) {
              entry.target.classList.remove('notInViewport')
            } else {
              entry.target.classList.add('notInViewport')
            }
          })
        },
        { mainSwiper, threshold: 1 },
      )

      const slides = mainSwiper ? mainSwiper.querySelectorAll('.swiper-slide') : []

      if (slides.length > 0) {
        slides.forEach(slide => {
          observer.observe(slide)
        })
      }
    } catch (e) {
      checkIfTokenAlive(e?.message, dispatch)
    }
  })

  //swiper

  useEffect(() => {
    if (isDedicOrderAllowed) {
      dispatch(
        dedicOperations.getTarifs(1, setNewVds, setDedicInfoList, signal, setIsLoading),
      )
    } else {
      navigate(route.DEDICATED_SERVERS, { replace: true })
    }
  }, [])

  useEffect(() => {
    const dedicList = tarifsList?.tarifList || []
    const sortedDedic = [...dedicList]
      .sort((a, b) => parsePrice(a.price.$).amount - parsePrice(b.price.$).amount)
      .sort((a, b) => parsePrice(b.price.$).length - parsePrice(a.price.$).length)

    const newArrTarifList = [...vdsList, ...sortedDedic]?.map(e => {
      const tag = tarifsList?.fpricelist.filter(plist =>
        e.desc.$.includes(plist.$.split(':')[1]),
      )
      return { ...e, filter: { tag } }
    })

    setTarifList({ ...tarifsList, tarifList: newArrTarifList })
  }, [tarifsList])

  useEffect(() => {
    const filteredTariffList = tarifList?.tarifList?.filter(el => {
      const filterList = el.filter.tag
      let hasFilter = true

      for (const key in filters) {
        hasFilter = filters[key].length
          ? filterList.some(filterItem => filters[key].includes(filterItem.$key))
          : true

        if (!hasFilter) break
      }

      return hasFilter
    })

    setFilteredTariffsList(filteredTariffList || [])
  }, [tarifList, filters])

  const validationSchema = Yup.object().shape({
    tarif: Yup.string().required('tariff is required'),
    domain: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
    license: Yup.boolean()
      .required('The terms and conditions must be accepted.')
      .oneOf([true], 'The terms and conditions must be accepted.'),
  })

  // VDS
  const setNewVds = data => {
    const vdsList = data
      .filter(el => VDS_IDS_TO_ORDER.includes(el.pricelist.$))
      .map(el => ({ ...el, isVds: true }))

    dispatch(dedicActions.setVDSList(vdsList))
  }

  const renderSoftwareOSFieldsVDS = (
    values,
    fieldName,
    setFieldValue,
    state,
    ostempl,
  ) => {
    let dataArr = vdsParameters.slist.find(el => el.$name === fieldName).val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software', { ns: 'vds' }) }]
    }

    dataArr.forEach(element => {
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
            state={state}
            getElement={value => {
              setFieldValue(fieldName, value)
              if (fieldName === 'ostempl') {
                setFieldValue('recipe', 'null')
                vdsParameters[fieldName].$ = value
                setVdsParameters({ ...vdsParameters })
              } else {
                setFieldValue('recipe', value)
              }

              if (value.includes('vestacp')) {
                onChangeField(
                  values.period,
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
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={value => {
              if (fieldName === 'ostempl') {
                setFieldValue('recipe', 'null')
                vdsParameters[fieldName].$ = value
                setVdsParameters({ ...vdsParameters })
              } else {
                setFieldValue('recipe', value)
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
        values.recipe,
        values.tarif,
        vdsParameters.register[fieldName] || fieldName,
        setVdsParameters,
        vdsParameters.register,
        signal,
        setIsLoading,
      ),
    )
  }

  const getOptionsListExtended = fieldName => {
    if (vdsParameters && vdsParameters.slist) {
      const optionsList = vdsParameters.slist.find(elem => elem.$name === fieldName)?.val

      let firstItem = 0

      return optionsList
        ?.filter(el => el?.$)
        ?.map(({ $key, $ }, index) => {
          let label = ''
          let withSale = false
          let words = []

          if (fieldName === 'Memory') {
            words = $?.match(/[\d|.|\\+]+/g)

            if (words?.length > 0 && index === 0) {
              firstItem = words[0]
            }

            if (words?.length > 0 && Number(words[0]) === firstItem * 2) {
              withSale = true
            }
          }

          if (withSale && words?.length > 0) {
            label = (
              <span className={s.selectWithSale}>
                <div className={s.sale55Icon}>-55%</div>
                <span className={s.saleSpan}>
                  {`${words[0]} Gb (`}
                  <span className={s.memorySale}>
                    {roundToDecimal(Number(words[1] / 0.45))}
                  </span>
                  {translatePeriodText($.trim().split('(')[1], t)}
                </span>
              </span>
            )
          } else if (fieldName === 'Memory' || $.includes('EUR ')) {
            label = translatePeriodText($.trim(), t)
          } else {
            label = t($.trim())
          }
          return {
            value: $key,
            label: label,
            sale: withSale,
            newPrice: roundToDecimal(Number(words[1])),
            oldPrice: roundToDecimal(Number(words[1]) + words[1] * 0.55),
          }
        })
    }
    return []
  }

  const getControlPanelList = fieldName => {
    const optionsList = vdsParameters.slist.find(elem => elem.$name === fieldName)?.val

    return optionsList?.map(({ $key, $ }) => {
      let label = translatePeriodText($.trim(), t)

      label = t(label?.split(' (')[0]) + ' (' + label?.split(' (')[1]
      return { value: $key, label: label }
    })
  }

  const onFormSubmitVds = values => {
    const saleMemory = getOptionsListExtended('Memory')?.find(
      e => e?.value === values.Memory,
    ).sale

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(
          vdsOperations.setOrderData(
            values.period,
            1,
            values.recipe,
            values,
            selectedTariffId,
            vdsParameters.register,
            saleMemory,
            true,
          ),
        ),
      ),
    )
  }

  const totalPrice = +vdsParameters?.orderinfo?.$?.match(/Total amount: (.+?)(?= EUR)/)[1]

  const handleSubmit = values => {
    const {
      tarif,
      period,
      managePanelName,
      portSpeedName,
      autoprolong,
      domain,
      ostempl,
      recipe,
      portSpeed,
      ipTotal,
      ipName,
      managePanel,
      server_name,
    } = values

    isTarifChosen === 'vds'
      ? onFormSubmitVds(values)
      : dispatch(
          userOperations.cleanBsketHandler(() =>
            dispatch(
              dedicOperations.orderServer(
                autoprolong,
                period,
                tarif,
                domain,
                ostempl,
                recipe,
                portSpeed,
                portSpeedName,
                managePanelName,
                ipTotal,
                ipName,
                managePanel,
                server_name,
                signal,
                setIsLoading,
              ),
            ),
          ),
        )
  }

  return (
    <>
      <div className={s.modalHeader}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h2 className={s.page_title}>{t('page_title')}</h2>

        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            tarif: dataFromSite?.pricelist || null,
            period: period,
            processor: null,
            domain: '',
            ipTotal: '1',
            price: null,
            license: true,
            server_name: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, touched, errors, setFieldTouched }) => {
            useEffect(() => {
              const cartFromSite = localStorage.getItem('site_cart')
              if (cartFromSite && tarifList?.tarifList?.length > 0) {
                const cartData = JSON.parse(cartFromSite)
                if (cartData?.pricelist) {
                  const tariff = tarifList?.tarifList?.find(
                    e => e?.pricelist?.$ === cartData?.pricelist,
                  )
                  setParameters(null)
                  setVdsParameters(null)
                  setTarifChosen(true)

                  if (VDS_IDS_TO_ORDER.includes(cartData?.pricelist)) {
                    setTarifChosen('vds')
                    setSelectedTariffId(cartData?.pricelist)
                    dispatch(
                      vdsOperations.getTariffParameters(
                        values.period,
                        cartData?.pricelist,
                        setVdsParameters,
                        signal,
                        setIsLoading,
                      ),
                    )
                  }

                  if (tariff) {
                    setPrice(parsePrice(tariff?.price?.$)?.amount)
                    setTarifChosen(true)

                    dispatch(
                      dedicOperations.getParameters(
                        '1',
                        cartData?.pricelist,
                        setParameters,
                        setFieldValue,
                        signal,
                        setIsLoading,
                      ),
                    )
                  }
                  localStorage.removeItem('site_cart')
                }
                setDataFromSite({
                  autoprolong: cartData?.autoprolong,
                  pricelist: cartData?.pricelist,
                  ostempl: cartData?.ostempl,
                  recipe: cartData?.recipe,
                  Controlpanel: cartData?.Controlpanel,
                  Portspeed: cartData?.Portspeed,
                  domain: cartData?.domain,
                  Port_speed: cartData?.Portspeed,
                  Control_panel: cartData?.Controlpanel,
                  CPU_count: cartData?.CPUcount,
                  Memory: cartData?.Memory,
                  Disk_space: cartData?.Diskspace,
                })
              }
            }, [tarifList])

            useEffect(() => {
              if (isTarifChosen === 'vds' && vdsParameters) {
                setFieldValue('ostempl', vdsParameters?.ostempl?.$)
                setFieldValue('recipe', vdsParameters?.recipe?.$)
                setFieldValue('autoprolong', vdsParameters?.autoprolong?.$)
                setFieldValue('domain', vdsParameters?.domain?.$)
                setFieldValue('CPU_count', vdsParameters?.CPU_count)
                setFieldValue('Memory', vdsParameters?.Memory)
                setFieldValue('Disk_space', vdsParameters?.Disk_space)
                setFieldValue('Port_speed', getPortSpeed(vdsParameters))
                setFieldValue('Control_panel', vdsParameters?.Control_panel)
                setFieldValue('IP_addresses_count', vdsParameters?.IP_addresses_count)
                setFieldValue('server_name', vdsParameters?.server_name?.$)
                setFieldValue('agreement', 'on')
              }
            }, [selectedTariffId, vdsParameters])

            return (
              <Form className={s.form}>
                <DedicFilter
                  filtersItems={tarifList?.fpricelist}
                  filters={filters}
                  setFilters={setFilters}
                  resetChosenTariff={() => {
                    setParameters(null)
                    setVdsParameters(null)
                    setFieldValue('tarif', 0)
                    setTarifChosen(false)
                  }}
                />
                <Select
                  height={50}
                  value={values.period}
                  getElement={item => {
                    setPrice('-')
                    setFieldValue('period', item)
                    setPeriod(item)
                    // setPaymentPeriod(item)
                    setParameters(null)
                    setVdsParameters(null)
                    setTarifChosen(false)
                    dispatch(
                      dedicOperations.getTarifs(
                        item,
                        setNewVds,
                        setDedicInfoList,
                        signal,
                        setIsLoading,
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

                {deskOrHigher ? (
                  <div className={s.tarifs_block}>
                    {filteredTariffsList
                      ?.filter(item => item.order_available.$ === 'on')
                      ?.map(item => {
                        return (
                          <DedicTarifCard
                            key={item?.desc?.$}
                            parsePrice={parsePrice}
                            item={item}
                            values={values}
                            setParameters={setParameters}
                            setFieldValue={setFieldValue}
                            setPrice={setPrice}
                            setTarifChosen={tariff => {
                              setTarifChosen(tariff)
                              runScroll()
                            }}
                            periodName={periodName}
                            setVdsParameters={setVdsParameters}
                            setSelectedTariffId={setSelectedTariffId}
                            signal={signal}
                            setIsLoading={setIsLoading}
                            dedicInfoList={dedicInfoList}
                          />
                        )
                      })}
                  </div>
                ) : (
                  <div className={s.dedic_swiper_rel_container}>
                    <div className={s.doubled_dedic_swiper_rel_container}>
                      <Swiper
                        className="dedic-swiper"
                        spaceBetween={0}
                        slidesPerView={'auto'}
                        effect={'creative'}
                        pagination={{
                          clickable: true,
                          el: '[data-dedic-swiper-pagination]',
                          dynamicBullets: true,
                          dynamicMainBullets: 1,
                        }}
                        breakpoints={{
                          650: {
                            pagination: {
                              dynamicMainBullets: 2,
                            },
                          },
                          768: {
                            pagination: {
                              dynamicMainBullets: 3,
                            },
                          },
                          1400: {
                            pagination: {
                              dynamicMainBullets: 4,
                            },
                          },
                        }}
                        onSwiper={setSwiperRef}
                      >
                        {filteredTariffsList
                          ?.filter(item => item.order_available.$ === 'on')
                          ?.map(item => {
                            return (
                              <SwiperSlide
                                className="dedic-swiper-element"
                                key={item?.desc?.$}
                              >
                                <DedicTarifCard
                                  key={item?.desc?.$}
                                  parsePrice={parsePrice}
                                  item={item}
                                  values={values}
                                  setParameters={setParameters}
                                  setFieldValue={setFieldValue}
                                  setPrice={setPrice}
                                  setTarifChosen={tariff => {
                                    setTarifChosen(tariff)
                                    runScroll()
                                  }}
                                  periodName={periodName}
                                  setVdsParameters={setVdsParameters}
                                  setSelectedTariffId={setSelectedTariffId}
                                  signal={signal}
                                  setIsLoading={setIsLoading}
                                  dedicInfoList={dedicInfoList}
                                />
                              </SwiperSlide>
                            )
                          })}
                      </Swiper>
                    </div>
                  </div>
                )}

                <div className="dedic_swiper_pagination">
                  <button onClick={handleLeftClick} type="button">
                    <Icon
                      name="ArrowSign"
                      className={`swiper-prev ${
                        isSwiperBeginning ? 'swiper-button-disabled' : ''
                      }`}
                    />
                  </button>
                  <div data-dedic-swiper-pagination></div>
                  <button onClick={handleRightClick} type="button">
                    <Icon
                      name="ArrowSign"
                      className={`swiper-next ${
                        isSwiperEnd ? 'swiper-button-disabled' : ''
                      }`}
                    />
                  </button>
                </div>

                {(parameters || vdsParameters) && (
                  <div className={s.parameters_block}>
                    <p ref={scrollElem} className={s.params}>
                      {t('os')}
                    </p>
                    <div className={s.software_OS_List}>
                      {renderSoftwareOSFields(
                        values,
                        'ostempl',
                        setFieldValue,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.params}>{t('recipe')}</p>

                    <div className={s.software_OS_List}>
                      {renderSoftwareOSFields(
                        values,
                        'recipe',
                        setFieldValue,
                        values.recipe,
                        values.ostempl,
                      )}
                    </div>

                    <p className={s.params}>{t('parameters')}</p>

                    <div className={s.parameters_wrapper}>
                      {vdsParameters && (
                        <>
                          <Select
                            itemsList={getOptionsListExtended('Memory')}
                            value={values.Memory}
                            label={`${t('memory', { ns: 'vds' })}:`}
                            getElement={value => {
                              setFieldValue('Memory', value)

                              onChangeField(
                                values.period,
                                { ...values, Memory: value },
                                'Memory',
                              )
                            }}
                            className={s.select}
                            isShadow
                            disabled={getOptionsListExtended('Memory').length < 2}
                          />

                          <Select
                            value={values.Disk_space}
                            itemsList={getOptionsListExtended('Disk_space')}
                            getElement={value => {
                              setFieldValue('Disk_space', value)

                              onChangeField(
                                values.period,
                                { ...values, Disk_space: value },
                                'Disk_space',
                              )
                            }}
                            label={`${t('disk_space', { ns: 'vds' })}:`}
                            className={s.select}
                            isShadow
                            disabled={getOptionsListExtended('Disk_space').length < 2}
                          />
                          <Select
                            value={values.CPU_count}
                            itemsList={getOptionsListExtended('CPU_count')}
                            getElement={value => {
                              setFieldValue('CPU_count', value)
                              onChangeField(
                                values.period,
                                { ...values, CPU_count: value },
                                'CPU_count',
                              )
                            }}
                            label={`${t('processors', { ns: 'vds' })}:`}
                            className={s.select}
                            isShadow
                            disabled={getOptionsListExtended('CPU_count').length < 2}
                          />
                          <InputField
                            name="Port_speed"
                            label={`${t('port_speed', { ns: 'vds' })}:`}
                            isShadow
                            disabled
                            className={s.input_field_wrapper}
                          />
                        </>
                      )}
                      <Select
                        height={50}
                        value={values.autoprolong}
                        label={`${t('autoprolong')}:`}
                        getElement={item => setFieldValue('autoprolong', item)}
                        isShadow
                        itemsList={
                          isTarifChosen === 'vds'
                            ? getOptionsListExtended('autoprolong')
                            : values?.autoprolonglList?.map(el => ({
                                label: translatePeriod(el?.$, el.$key, t),
                                value: el.$key,
                              }))
                        }
                        className={s.select}
                      />
                      <InputField
                        label={`${t('domain_name')}:`}
                        placeholder={`${t('domain_placeholder')}`}
                        name="domain"
                        isShadow
                        error={!!errors.domain}
                        touched={!!touched.domain}
                        className={s.input_field_wrapper}
                        inputClassName={s.text_area}
                        autoComplete="off"
                        type="text"
                        value={values?.domain}
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
                      {isTarifChosen === 'dedic' && (
                        <Select
                          height={50}
                          value={values?.managePanel}
                          getElement={item => {
                            setFieldValue('managePanel', item)
                            updatePrice(
                              { ...values, managePanel: item },
                              dispatch,
                              setPrice,
                              signal,
                              setIsLoading,
                            )
                          }}
                          isShadow
                          label={`${t('license_to_panel', { ns: 'vds' })}:`}
                          itemsList={values?.managePanellList?.map(el => {
                            let labelText = el.$

                            if (labelText.includes('Without a license')) {
                              labelText = labelText.replace(
                                'Without a license',
                                t('Without a license'),
                              )
                            }

                            if (labelText.includes('EUR')) {
                              labelText = translatePeriodText(labelText, t)
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
                      )}

                      {isTarifChosen === 'vds' && (
                        <Select
                          value={values.Control_panel}
                          itemsList={getControlPanelList('Control_panel')}
                          getElement={value => {
                            setFieldValue('Control_panel', value)
                            onChangeField(
                              values.period,
                              { ...values, Control_panel: value },
                              'Control_panel',
                            )
                          }}
                          label={`${t('license_to_panel', { ns: 'vds' })}:`}
                          isShadow
                          className={s.select}
                          disabled={getOptionsListExtended('Control_panel').length < 2}
                        />
                      )}

                      {values?.portSpeedlList?.length > 0 && (
                        <Select
                          height={50}
                          getElement={item => {
                            setFieldValue('portSpeed', item)
                            updatePrice(
                              { ...values, portSpeed: item },
                              dispatch,
                              setPrice,
                              signal,
                              setIsLoading,
                            )
                          }}
                          isShadow
                          label={`${t('port_speed')}:`}
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

                      {values?.ipList?.length > 0 && isTarifChosen === 'dedic' && (
                        <Select
                          height={50}
                          value={values?.ipTotal?.toString()}
                          getElement={item => {
                            setFieldValue('ipTotal', item)
                            updatePrice(
                              { ...values, ipTotal: item },
                              dispatch,
                              setPrice,
                              signal,
                              setIsLoading,
                            )
                          }}
                          isShadow
                          label={`${t('count_ip')}:`}
                          itemsList={values?.ipList?.map(el => {
                            return {
                              label: `${el?.value}
                          ${t('pcs.', {
                            ns: 'vds',
                          })}
                          (${roundToDecimal(el?.cost)} EUR)`,
                              value: el?.value?.toString(),
                            }
                          })}
                          className={s.select}
                        />
                      )}

                      {isTarifChosen === 'vds' && (
                        <InputField
                          name="IP_addresses_count"
                          label={`${t('count_ip', { ns: 'dedicated_servers' })}:`}
                          isShadow
                          disabled
                          className={s.input_field_wrapper}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div
                  className={classNames({
                    [s.buy_btn_block]: true,
                    [s.active]: !!isTarifChosen,
                  })}
                >
                  <div className={s.container}>
                    {tabletOrHigher ? (
                      <div className={s.sum_price_wrapper}>
                        {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                        <span className={s.btn_price}>
                          {(isTarifChosen === 'vds'
                            ? roundToDecimal(totalPrice)
                            : roundToDecimal(price)) +
                            ' €' +
                            '/' +
                            periodName}
                        </span>
                      </div>
                    ) : (
                      <div className={s.sum_price_wrapper}>
                        {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                        <p className={s.btn_price_wrapper}>
                          <span className={s.btn_price}>
                            {'€' +
                              (isTarifChosen === 'vds'
                                ? roundToDecimal(totalPrice)
                                : roundToDecimal(price))}
                          </span>
                          {'/' + periodName}
                        </p>
                      </div>
                    )}
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
                          licenceCheck?.current?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    />
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}

function updatePrice(formValues, dispatch, setNewPrice, signal, setIsLoading) {
  dispatch(
    dedicOperations.updatePrice(
      formValues.period,
      formValues.tarif,
      formValues.domain,
      formValues.ostempl,
      formValues.recipe,
      formValues.portSpeed,
      formValues.portSpeedName,
      formValues.managePanelName,
      formValues.ipTotal,
      formValues.ipName,
      formValues.managePanel,
      setNewPrice,
      signal,
      setIsLoading,
    ),
  )
}
