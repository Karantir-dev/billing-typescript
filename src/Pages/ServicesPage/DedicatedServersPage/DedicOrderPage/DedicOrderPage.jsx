import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
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
  // dedicActions,
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
import {
  NEW_DEDICS,
  // VDS_IDS_TO_ORDER,
  DEDIC_FILTER_RANGE_GROUPS,
} from '@src/utils/constants'
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
  const [periodName, setPeriodName] = useState('')
  const [isTarifChosen, setTarifChosen] = useState(false)
  const [period, setPeriod] = useState('1')
  const [filteredTariffsList, setFilteredTariffsList] = useState()
  const [filterPrice, setFilterPrice] = useState([0, 0])
  const [maxPrice, setMaxPrice] = useState()

  useEffect(() => {
    /* set filters groups  */
    /* avoid to reset filter on change period */
    if (!Object.keys(filters).length) {
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
    }

    /* set tariffs list  */
    const initialDedicList = tarifsList?.tarifList || []

    const sortedDedic = sortDedicList(initialDedicList)

    const separatedDedicList = sortedDedic.reduce(
      (res, dedic) => {
        const params = getParams(dedic)
        const configName = params[0]
        let tag = tarifsList?.fpricelist.filter(plist => {
          return dedic.filter.tag.find(tagItem => plist.$key === tagItem.$)
        })

        /* Config 41 has additional filters tags to filter VDS tariffs,
          here we remove those tags form config 41 to filter works correct  */
        if (dedic.desc.$.includes('Config 41')) {
          const drive = params.find(el => el.includes('SSD')).replace(' SSD', '')
          tag = tag.filter(el =>
            el.$.includes('drive:') ? drive === el.$.replace('drive:', '') : el,
          )
        }

        const item = { ...dedic, filter: { tag } }

        NEW_DEDICS.includes(configName)
          ? res.newDedicList.push({ ...item, isNew: true })
          : res.dedicList.push(item)

        return res
      },
      {
        newDedicList: [],
        dedicList: [],
      },
    )

    const newVdsList = [...vdsList]?.map(el => {
      const params = getParams(el)

      const gen = params.find(param => param.includes('HP G')).replace('HP ', '')
      const ram = params.find(param => param.includes(' RAM DDR')).split(' RAM')[0]
      const ramtype = params.find(param => param.includes(' RAM DDR')).split('RAM ')[1]
      const drive = params.find(param => param.includes('NVMe')).split(' NVMe')[0]
      const cpucores = params
        .find(param => param.includes('vCPU'))
        .split(' vCPU')[0]
        .trim()
      const cpu = 'Xeon Silver 4116'
      const cpumanuf = 'Intel'
      const drivetype = 'NVMe'
      const raid = 'No HW'
      const gpu = 'none'
      const traffic = '100TB'

      const tag = tarifsList?.fpricelist.filter(plist => {
        const [key, value] = plist.$.split(':')
        switch (key) {
          case 'gen':
            return value === gen
          case 'cpu':
            return value === cpu
          case 'cpucores':
            return value === cpucores
          case 'cpumanuf':
            return value === cpumanuf
          case 'ram':
            return value === ram
          case 'ramtype':
            return value === ramtype
          case 'drive':
            return value === drive
          case 'drivetype':
            return value === drivetype
          case 'raid':
            return value === raid
          case 'gpu':
            return value === gpu
          case 'traffic':
            return value === traffic
        }
      })
      return { ...el, filter: { tag } }
    })

    const newArrTarifList = [
      ...separatedDedicList.newDedicList,
      ...newVdsList,
      ...separatedDedicList.dedicList,
    ]

    /* avoid to reset filter on change period */
    const isFiltered = Object.keys(filters).some(key => filters[key].length)
    const setFilteredTarifList =
      filteredTariffsList?.length || isFiltered
        ? newArrTarifList.filter(tariff => {
            return filteredTariffsList.find(el => el.pricelist.$ === tariff.pricelist.$)
          })
        : newArrTarifList

    if (setFilteredTarifList.length) {
      const newMaxPrice = +roundToDecimal(
        parsePrice([...setFilteredTarifList].reverse()[0]?.price.$).amount,
        'ceil',
        0,
      )

      const newMinPriceValue = filterPrice[0] > newMaxPrice ? newMaxPrice : filterPrice[0]
      const newMaxPriceValue =
        filterPrice[1] > newMaxPrice || !filterPrice[1] || filterPrice[1] === maxPrice
          ? newMaxPrice
          : filterPrice[1]

      setMaxPrice(newMaxPrice)
      setFilterPrice([newMinPriceValue, newMaxPriceValue])
      setFiltersItems(getFiltersItems())
      setTarifList({ ...tarifsList, tarifList: newArrTarifList })
      setFilteredTariffsList(setFilteredTarifList)
    }
  }, [tarifsList])

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
      dispatch(dedicOperations.getTarifs(1, setDedicInfoList, signal, setIsLoading))
    } else {
      navigate(route.DEDICATED_SERVERS, { replace: true })
    }
  }, [])

  const sortDedicList = list =>
    [...list].sort((a, b) => parsePrice(a.price.$).amount - parsePrice(b.price.$).amount)

  const getParams = el => el.desc.$.split(' / ')

  const sortCategoriesByQuantity = (...args) =>
    args.map(arg =>
      arg?.sort((a, b) => +a.$.replace(/\D/g, '') - +b.$.replace(/\D/g, '')),
    )

  const getFiltersItems = () => {
    const items =
      tarifsList.fpricelist?.reduce((acc, el) => {
        const category = el.$.split(':')[0]

        acc[category] = [...(acc?.[category] || []), { ...el, available: true }]

        return acc
      }, {}) || {}

    sortCategoriesByQuantity(items.gen, items.ram, items.cpucores, items.drive)

    items.drive?.sort((a, b) =>
      a.$.replace(/\d/g, '').localeCompare(b.$.replace(/\d/g, '')),
    )

    return items
  }

  const validationSchema = Yup.object().shape({
    tarif: Yup.string().required('tariff is required'),
  })

  // VDS
  // const setNewVds = data => {
  //   const vdsList = data
  //     .filter(el => VDS_IDS_TO_ORDER.includes(el.pricelist.$))
  //     .map(el => ({ ...el, isVds: true }))

  //   dispatch(dedicActions.setVDSList(vdsList))
  // }

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
    const price = +parameters?.list?.find(item => item.$name === 'total_summary').elem[0]
      .cost.price.cost.$

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

  const renderFilteredTariffsByPrice = useMemo(
    () =>
      filteredTariffsList
        ?.filter(item => item.order_available.$ === 'on')
        ?.filter(item => {
          const price = parsePrice(item.price.$).amount
          return price >= filterPrice[0] && price <= filterPrice[1]
        }),
    [filteredTariffsList, filterPrice],
  )

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
              const isRangeCategory = DEDIC_FILTER_RANGE_GROUPS.includes(category)

              let copyFilters = JSON.parse(JSON.stringify(filters))
              let isAdding = true

              if (isRangeCategory) {
                if (
                  value[0] === 0 &&
                  value[1] === copyFiltersItems[category].length - 1
                ) {
                  copyFilters = {
                    ...copyFilters,
                    [category]: [],
                  }
                } else {
                  const filterValues = copyFiltersItems[category]
                    .filter((_, i) => {
                      return i >= value[0] && i <= value[1]
                    })
                    .map(el => el.$key)

                  copyFilters = {
                    ...copyFilters,
                    [category]: [...filterValues],
                  }
                }
              } else if (filters?.[category]?.includes(value)) {
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
              let categories = isRangeCategory
                ? selectedCategories
                : isAdding
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
                  if (DEDIC_FILTER_RANGE_GROUPS.includes(key)) return true
                  const filterList = tariff.filter.tag
                  let hasFilter = true

                  for (let i = 0; i < index; i++) {
                    hasFilter = DEDIC_FILTER_RANGE_GROUPS.includes(categoriesKeys[i])
                      ? true
                      : checkIfHasFilter(copyFilters, categoriesKeys[i], filterList)

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
                  filterPrice={filterPrice}
                  maxPrice={maxPrice}
                  setFilterPrice={setFilterPrice}
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
                        // setNewVds,
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

                {tarifsList?.tarifList &&
                  (!renderFilteredTariffsByPrice?.length ? (
                    <div className={s.no_service_wrapper}>
                      <img
                        src={require('@images/services/no_dedic_server.png')}
                        alt="dedic"
                        className={s.dedic_img}
                      />
                      <p className={s.no_service_title}>
                        {t('empty_dedic_tariffs_title', {
                          ns: 'dedicated_servers',
                        })}
                      </p>
                      <p>{t('empty_dedic_tariffs_text', { ns: 'dedicated_servers' })}</p>
                    </div>
                  ) : deskOrHigher ? (
                    <div className={s.tarifs_block}>
                      {renderFilteredTariffsByPrice?.map(item => {
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
                    <>
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
                            {renderFilteredTariffsByPrice?.map(item => {
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
                    </>
                  ))}

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
