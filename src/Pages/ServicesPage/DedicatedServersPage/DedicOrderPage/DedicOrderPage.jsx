import { useCallback, useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BreadCrumbs, Button, Select, Icon, Loader, TariffConfig } from '@components'
import DedicTarifCard from './DedicTarifCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import classNames from 'classnames'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import {
  cartActions,
  cartOperations,
  dedicActions,
  dedicOperations,
  dedicSelectors,
  userOperations,
} from '@redux'
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  checkIfTokenAlive,
  useScrollToElement,
  useCancelRequest,
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
  const [selectedTariffId, setSelectedTariffId] = useState()
  const [price, setPrice] = useState(0)
  const [dedicInfoList, setDedicInfoList] = useState([])

  const [filters, setFilters] = useReducer(reducer, {})
  const [selectedCategories, setSelectedCategories] = useState([])
  const [filtersItems, setFiltersItems] = useState({})

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
  const [period, setPeriod] = useState('1')
  const [filteredTariffsList, setFilteredTariffsList] = useState([])

  const [scrollElem, runScroll] = useScrollToElement({
    condition: parameters,
  })

  const parsePrice = price => {
    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    let periodName

    if (price.includes('for three months')) {
      periodName = t('for three months').toLocaleLowerCase()
    } else if (price.includes('for two years')) {
      periodName = t('for two years').toLocaleLowerCase()
    } else if (price.includes('for three years')) {
      periodName = t('for three years').toLocaleLowerCase()
    } else if (price.includes('half a year')) {
      periodName = t('half a year', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('year')) {
      periodName = t('year', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('years')) {
      periodName = t('years', { ns: 'other' }).toLocaleLowerCase()
    } else if (price.includes('month')) {
      periodName = t('month', { ns: 'other' }).toLocaleLowerCase()
    } else {
      periodName = t('for three months', { ns: 'other' }).toLocaleLowerCase()
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

    return {
      amount,
      percent,
      sale,
      periodName,
      length: amounts.length,
    }
  }

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')
    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
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

    setFiltersItems(getFiltersItems())
    setTarifList({ ...tarifsList, tarifList: newArrTarifList })
    setFilteredTariffsList(newArrTarifList)
  }, [tarifsList])

  const getFiltersItems = () =>
    tarifsList.fpricelist?.reduce((acc, el) => {
      const category = el.$.split(':')[0]

      acc[category] = [...(acc?.[category] || []), { ...el, available: true }]

      return acc
    }, {}) || {}

  const validationSchema = Yup.object().shape({
    tarif: Yup.string().required('tariff is required'),
  })

  // VDS
  const setNewVds = data => {
    const vdsList = data
      .filter(el => VDS_IDS_TO_ORDER.includes(el.pricelist.$))
      .map(el => ({ ...el, isVds: true }))

    dispatch(dedicActions.setVDSList(vdsList))
  }

  const handleSubmit = () => {
    const { register, ostempl, recipe, domain, server_name } = parameters

    const params = {
      service: isTarifChosen,
      id: selectedTariffId,
      period: parameters.order_period.$,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      autoprolong: parameters.autoprolong?.$ === 'on' ? parameters.order_period.$ : 'off',
      domain: domain?.$ || '',
      server_name: server_name?.$ || '',
    }

    for (const key in register) {
      params[register[key]] = parameters[key]
    }

    dispatch(
      userOperations.cleanBsketHandler(() =>
        dispatch(
          cartOperations.setOrderData(params, () =>
            dispatch(
              cartActions.setCartIsOpenedState({
                isOpened: true,
                redirectPath: route.DEDICATED_SERVERS,
              }),
            ),
          ),
        ),
      ),
    )
  }

  useEffect(() => {
    const price = +parameters?.list?.find(item => item.$name === 'pricelist_summary')
      .elem[0].cost.price.cost.$

    setPrice(roundToDecimal(price))
  }, [parameters])

  const changeFieldHandler = (field, value, isUpdatePrice) => {
    if (!isUpdatePrice) {
      setParameters(params => ({ ...params, [field]: value }))
      return
    }

    const { register, ostempl, recipe, domain, server_name } = parameters

    const params = {
      service: isTarifChosen,
      id: selectedTariffId,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      period,
      autoprolong: parameters.autoprolong.$,
      domain: domain?.$,
      server_name: server_name?.$,
    }

    for (const key in register) {
      params[register[key]] = key === field ? value : parameters[key]
    }

    dispatch(
      cartOperations.getTariffParameters(
        params,
        setParameters,
        undefined,
        signal,
        setIsLoading,
      ),
    )
  }

  const clearFiltersHandler = () => {
    setFilteredTariffsList(tarifList?.tarifList)
    setFilters({ type: 'clear_filter' })
    setSelectedCategories([])
    setFiltersItems(getFiltersItems())
  }

  const checkIfHasFilter = (filters, key, filterList) =>
    filters[key].length
      ? filterList.some(filterItem => filters[key].includes(filterItem.$key))
      : true

  return (
    <>
      <div className={s.modalHeader}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h2 className={s.page_title}>{t('page_title')}</h2>

        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            tarif: null,
            period: period,
            processor: null,
            domain: '',
            ipTotal: '1',
            price: null,
            server_name: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            const changeFilterHandler = (value, category) => {
              const copyFiltersItems = JSON.parse(JSON.stringify(filtersItems))

              let copyFilters = JSON.parse(JSON.stringify(filters))
              let isAdding = true

              if (filters?.[category]?.includes(value)) {
                copyFilters = {
                  ...copyFilters,
                  [category]: copyFilters[category].filter(el => el !== value),
                }
                isAdding = false
              } else {
                copyFilters = {
                  ...copyFilters,
                  [category]: [...copyFilters[category], value],
                }
              }
              setParameters(null)
              setFieldValue('tarif', 0)
              setTarifChosen(false)

              let categories = isAdding
                ? selectedCategories.includes(category)
                  ? selectedCategories
                  : [...selectedCategories, category]
                : copyFilters[category].length
                ? selectedCategories
                : selectedCategories.filter(el => el !== category)

              const categoriesKeys = [
                ...new Set([...categories, ...Object.keys(copyFilters)]),
              ]

              const allowedFilters = categoriesKeys.reduce((acc, key, index) => {
                acc[key] = tarifList?.tarifList?.filter(tariff => {
                  const filterList = tariff.filter.tag
                  let hasFilter = true

                  for (let i = 0; i < index; i++) {
                    hasFilter = checkIfHasFilter(
                      copyFilters,
                      categoriesKeys[i],
                      filterList,
                    )

                    if (!hasFilter) break
                  }

                  return hasFilter
                })

                copyFilters[key] = copyFilters[key].filter(el =>
                  JSON.stringify(acc[key]).includes(el),
                )

                if (!copyFilters[key].length) {
                  categories = categories.filter(el => el !== key)
                }

                return acc
              }, {})

              for (const key in copyFiltersItems) {
                copyFiltersItems[key] = copyFiltersItems[key].map(el => ({
                  ...el,
                  available: JSON.stringify(allowedFilters[key]).includes(el.$key),
                }))
              }

              const filteredTariffList = tarifList?.tarifList?.filter(el => {
                const filterList = el.filter.tag
                let hasFilter

                for (const key in copyFilters) {
                  hasFilter = checkIfHasFilter(copyFilters, key, filterList)

                  if (!hasFilter) break
                }

                return hasFilter
              })

              setFilters({ type: 'update_filter', value: copyFilters })
              setFiltersItems(copyFiltersItems)
              setSelectedCategories(categories)
              setFilteredTariffsList(filteredTariffList || [])
            }
            return (
              <Form className={s.form}>
                <DedicFilter
                  filtersItems={filtersItems}
                  filters={filters}
                  changeFilterHandler={changeFilterHandler}
                  clearFiltersHandler={clearFiltersHandler}
                />
                <Select
                  height={50}
                  value={values.period}
                  getElement={item => {
                    setPrice(0)
                    setFieldValue('period', item)
                    setPeriod(item)
                    setParameters(null)
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
                            setTarifChosen={tariff => {
                              setTarifChosen(tariff)
                              runScroll()
                            }}
                            setSelectedTariffId={setSelectedTariffId}
                            signal={signal}
                            setIsLoading={setIsLoading}
                            dedicInfoList={dedicInfoList}
                            setPeriodName={setPeriodName}
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
                                  setTarifChosen={tariff => {
                                    setTarifChosen(tariff)
                                    runScroll()
                                  }}
                                  setSelectedTariffId={setSelectedTariffId}
                                  signal={signal}
                                  setIsLoading={setIsLoading}
                                  dedicInfoList={dedicInfoList}
                                  setPeriodName={setPeriodName}
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
                          {roundToDecimal(price) + ' €' + '/' + periodName}
                        </span>
                      </div>
                    ) : (
                      <div className={s.sum_price_wrapper}>
                        {tabletOrHigher && <span className={s.topay}>{t('topay')}:</span>}
                        <p className={s.btn_price_wrapper}>
                          <span className={s.btn_price}>
                            {'€' + roundToDecimal(price)}
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
                    />
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
        {parameters && (
          <div ref={scrollElem}>
            <TariffConfig
              parameters={parameters}
              setParameters={setParameters}
              setIsFormError={() => {}}
              service={parameters ? 'dedic' : 'vds'}
              changeFieldHandler={changeFieldHandler}
            />
          </div>
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
