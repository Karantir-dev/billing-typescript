import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BreadCrumbs,
  Button,
  SoftwareOSBtn,
  SoftwareOSSelect,
  Toggle,
  Select,
  InputField,
} from '@components'
import DedicTarifCard from './DedicTarifCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { dedicOperations, dedicSelectors, userOperations } from '@redux'
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ArrowSign } from '@images'
import { checkIfTokenAlive, useScrollToElement, translatePeriod } from '@utils'
import * as route from '@src/routes'
import * as Yup from 'yup'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import s from './DedicOrderPage.module.scss'
import './DedicSwiper.scss'

SwiperCore.use([EffectCoverflow, Pagination])

export default function DedicOrderPage() {
  const dispatch = useDispatch()
  const licenceCheck = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  const isDedicOrderAllowed = location?.state?.isDedicOrderAllowed

  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const { t } = useTranslation(['dedicated_servers', 'other', 'vds', 'autoprolong'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const deskOrHigher = useMediaQuery({ query: '(min-width: 1549px)' })

  const [tarifList, setTarifList] = useState(tarifsList)
  const [parameters, setParameters] = useState(null)
  // const [datacenter, setDatacenter] = useState(tarifList?.currentDatacenter)
  // const [paymentPeriod, setPaymentPeriod] = useState(null)
  const [price, setPrice] = useState('')
  const [filters, setFilters] = useState([])
  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)
  const [dataFromSite, setDataFromSite] = useState(null)

  const [scrollElem, runScroll] = useScrollToElement({ condition: parameters })

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
            if (entry.isIntersecting) {
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
      server_name,
    } = values

    dispatch(
      userOperations.cleanBsketHandler(() =>
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
            server_name,
          ),
        ),
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
          tarif: dataFromSite?.pricelist || null,
          period: '1',
          processor: null,
          domainname: '',
          ipTotal: '1',
          price: null,
          license: true,
          server_name: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors, resetForm, setFieldTouched }) => {
          useEffect(() => {
            const cartFromSite = localStorage.getItem('site_cart')
            if (cartFromSite && tarifList?.tarifList?.length > 0) {
              const cartData = JSON.parse(cartFromSite)
              if (cartData?.pricelist) {
                const tariff = tarifList?.tarifList?.find(
                  e => e?.pricelist?.$ === cartData?.pricelist,
                )
                setParameters(null)
                setTarifChosen(true)
                if (tariff) {
                  setPrice(parsePrice(tariff?.price?.$)?.amoumt)
                  setTarifChosen(true)

                  dispatch(
                    dedicOperations.getParameters(
                      '1',
                      tarifList?.currentDatacenter,
                      cartData?.pricelist,
                      setParameters,
                      setFieldValue,
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
              })
            }
          }, [tarifList])
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
                          // setPaymentPeriod(item)
                          setFieldValue('datacenter', item?.$key)
                          setParameters(null)
                          setFilters([])
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
                          src={require('@images/countryFlags/netherlands_flag.webp')}
                          alt="nth_flag"
                        />
                        <div className={s.datacenter__info}>
                          <p className={s.country_name}>{countryName}</p>
                          <span className={s.datacenter}>{datacenterName}</span>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
              <div
                className={classNames({
                  [s.processors_block]: true,
                })}
              >
                <div className={s.first_processors_block}>
                  <p className={s.processors_block__label}>{t('port')}:</p>
                  <div className={s.processors_block__row}>
                    {tarifList?.fpricelist
                      ?.filter(el => el.$.toLowerCase().includes('port'))
                      .map(item => {
                        return (
                          <div
                            className={classNames(s.processor_card, {
                              [s.selected]: true,
                            })}
                            key={item?.$key}
                          >
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
                              view="radio"
                            />
                            <span className={s.processor_name}>{item?.$}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
                <div className={s.second_processors_block}>
                  <p className={s.processors_block__label}>{t('server_model')}:</p>
                  <div className={s.processors_block__row}>
                    {tarifList?.fpricelist
                      ?.filter(el => !el.$.toLowerCase().includes('port'))
                      .map(item => {
                        return (
                          <div
                            className={classNames(s.processor_card, {
                              [s.selected]: true,
                            })}
                            key={item?.$key}
                          >
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
                              view="radio"
                            />
                            <span className={s.processor_name}>{item?.$}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              <Select
                height={50}
                value={values.period}
                getElement={item => {
                  setPrice('-')
                  resetForm()
                  setFieldValue('period', item)
                  // setPaymentPeriod(item)
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

              {deskOrHigher ? (
                <div className={s.tarifs_block}>
                  {tariffsListToRender
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
                          setTarifChosen={() => {
                            setTarifChosen(true)
                            runScroll()
                          }}
                          periodName={periodName}
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
                      {tariffsListToRender
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
                                setTarifChosen={() => {
                                  setTarifChosen(true)
                                  runScroll()
                                }}
                                periodName={periodName}
                              />
                            </SwiperSlide>
                          )
                        })}
                    </Swiper>
                  </div>
                </div>
              )}

              <div className="dedic_swiper_pagination">
                <button onClick={handleLeftClick}>
                  <ArrowSign
                    className={`swiper-prev ${
                      isSwiperBeginning ? 'swiper-button-disabled' : ''
                    }`}
                  />
                </button>
                <div data-dedic-swiper-pagination></div>
                <button onClick={handleRightClick}>
                  <ArrowSign
                    className={`swiper-next ${
                      isSwiperEnd ? 'swiper-button-disabled' : ''
                    }`}
                  />
                </button>
              </div>

              {parameters && (
                <div className={s.parameters_block}>
                  <p ref={scrollElem} className={s.params}>
                    {t('os')}
                  </p>
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
                      label={`${t('autoprolong')}:`}
                      getElement={item => setFieldValue('autoprolong', item)}
                      isShadow
                      itemsList={values?.autoprolonglList?.map(el => ({
                        label: translatePeriod(el?.$, t),
                        value: el.$key,
                      }))}
                      className={s.select}
                    />
                    <InputField
                      label={`${t('domain_name')}:`}
                      placeholder={`${t('domain_placeholder')}`}
                      name="domainname"
                      isShadow
                      error={!!errors.domainname}
                      touched={!!touched.domainname}
                      className={s.input_field_wrapper}
                      inputClassName={s.text_area}
                      autoComplete="off"
                      type="text"
                      value={values?.domainname}
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
                      label={`${t('license_to_panel', { ns: 'vds' })}:`}
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

                    {values?.ipList?.length > 0 && (
                      <Select
                        height={50}
                        value={values?.ipTotal?.toString()}
                        getElement={item => {
                          setFieldValue('ipTotal', item)
                          updatePrice({ ...values, ipTotal: item }, dispatch, setPrice)
                        }}
                        isShadow
                        label={`${t('count_ip')}:`}
                        itemsList={values?.ipList?.map(el => {
                          return {
                            label: `${el?.value}
                          ${t('pcs.', {
                            ns: 'vds',
                          })}
                          (${el?.cost} EUR)`,
                            value: el?.value?.toString(),
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
                        error={!values.license && touched?.license}
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
                    {!values.license && touched?.license && (
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
                      <p className={s.btn_price_wrapper}>
                        <span className={s.btn_price}>{'€' + price}</span>
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
