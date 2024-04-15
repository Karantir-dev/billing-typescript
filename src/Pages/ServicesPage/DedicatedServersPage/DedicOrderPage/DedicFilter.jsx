import { CheckBox, Icon, InputRange } from '@components'
import s from './DedicOrderPage.module.scss'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useReducer, useState } from 'react'
import cn from 'classnames'
import { DEDIC_FILTER_RANGE_GROUPS } from '@src/utils/constants'

const FILTER_ORDER = ['gen', 'cpu', 'ram', 'drive', 'raid', 'gpu', 'traffic', 'rate']
const FILTERS_GROUPS = ['cpu', 'ram', 'drive']

export default function DedicFilter({
  filtersItems,
  filters,
  filterPrice,
  maxPrice,
  setFilterPrice,
  changeFilterHandler,
  clearFiltersHandler,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [openedCategory, setOpenedCategory] = useState('')
  const [secondOpenedCategory, setSecondOpenedCategory] = useState('')
  const [priceValues, setPriceValues] = useState(filterPrice)

  const renderCategory = new Set([...FILTER_ORDER, ...Object.keys(filtersItems)])

  const [rangeValues, setRangeValues] = useReducer((state, action) => {
    if (action === 'clear') return {}
    return { ...state, ...action }
  }, {})

  const [rangeLists, setRangeLists] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  useEffect(() => {
    if (isFirstRender && Object.keys(filtersItems).length) {
      const rangeList = DEDIC_FILTER_RANGE_GROUPS.reduce((acc, key) => {
        acc[key] = filtersItems[key]?.map(el => el.$.replace(/\D/g, ''))
        return acc
      }, {})

      setRangeLists(rangeList)
      setIsFirstRender(false)
    }
  }, [filtersItems])

  useEffect(() => {
    setPriceValues(filterPrice)
  }, [filterPrice])

  const filtersCategories = useMemo(
    () =>
      [...renderCategory].reduce((acc, el) => {
        const key = FILTERS_GROUPS.find(group => el.includes(group)) || el
        acc[key] = [...(acc[key] || []), el]
        return acc
      }, {}),
    [filtersItems],
  )

  const isFiltered =
    Object.values(filters).some(filter => filter.length) ||
    filterPrice[0] > 0 ||
    filterPrice[1] < maxPrice

  const onClearHandler = () => {
    clearFiltersHandler()
    setOpenedCategory('')
    setSecondOpenedCategory('')
    setRangeValues('clear')
    setFilterPrice([0, maxPrice])
  }

  return (
    <div className={s.filter__wrapper}>
      <div className={s.filter}>
        <div>
          <InputRange
            id="price"
            min={0}
            max={maxPrice}
            value={priceValues}
            onInput={setPriceValues}
            onThumbDragEnd={data => setFilterPrice(data ?? priceValues)}
            rangeSlideDisabled
            withFields
          />
        </div>
        {[...renderCategory]?.map(category => {
          const isOpened = openedCategory === category

          const categoryItems = filtersCategories[category]?.reduce(
            (acc, el) => {
              acc.count += DEDIC_FILTER_RANGE_GROUPS.includes(el)
                ? filters[el]?.length
                  ? 1
                  : 0
                : filters[el]?.length
              acc.isAvailable =
                acc.isAvailable || filtersItems[el]?.some(filter => filter.available)

              return acc
            },
            { count: 0, isAvailable: false },
          )

          return (
            filtersCategories[category] && (
              <div key={category}>
                <button
                  className={cn(s.filter__btn, { [s.opened]: isOpened })}
                  onClick={() => setOpenedCategory(isOpened ? '' : category)}
                  type="button"
                  disabled={!categoryItems.isAvailable}
                >
                  <span className={s.filter__label}>{t(category)}</span>

                  {!!categoryItems.count && (
                    <span className={s.filter_amount}>{categoryItems.count}</span>
                  )}

                  <Icon name="ArrowSign" className={s.filter__btn_icon} />
                </button>
                {filtersCategories[category]?.map((group, _, arr) => {
                  const isSecondOpened =
                    secondOpenedCategory === group || arr.length === 1
                  return (
                    <div
                      className={cn(s.filter__option_wrapper, { [s.opened]: isOpened })}
                      key={group}
                    >
                      {arr.length > 1 && (
                        <button
                          className={cn(s.filter__btn, {
                            [s.opened]: isSecondOpened,
                          })}
                          onClick={() =>
                            setSecondOpenedCategory(isSecondOpened ? '' : group)
                          }
                          type="button"
                          disabled={!categoryItems.isAvailable}
                        >
                          <span className={s.filter__label}>
                            {t(`subcategory.${group}`)}
                          </span>

                          <Icon name="ArrowSign" className={s.filter__btn_icon} />
                        </button>
                      )}
                      <div
                        className={cn(s.filter__option_wrapper, {
                          [s.opened]: isSecondOpened,
                        })}
                      >
                        {DEDIC_FILTER_RANGE_GROUPS.includes(group) ? (
                          <>
                            {(secondOpenedCategory === group ||
                              (isOpened && arr.length === 1)) && (
                              <InputRange
                                id={group}
                                min={0}
                                max={rangeLists[group]?.length - 1}
                                value={
                                  rangeValues[group] || [0, rangeLists[group]?.length - 1]
                                }
                                onInput={value => {
                                  setRangeValues({ [group]: value })
                                }}
                                onThumbDragEnd={() => {
                                  changeFilterHandler(
                                    [rangeValues[group]?.[0], rangeValues[group]?.[1]],
                                    group,
                                  )
                                }}
                                withLabel
                                labels={rangeLists[group]}
                                rangeSlideDisabled
                              />
                            )}
                          </>
                        ) : (
                          [...(filtersItems?.[group] || [])]
                            ?.sort((a, b) => b.available - a.available)
                            .map(item => (
                              <div className={s.filter__option} key={item?.$key}>
                                <CheckBox
                                  value={filters?.[group]?.includes(item?.$key)}
                                  onClick={() => changeFilterHandler(item?.$key, group)}
                                  disabled={!item.available}
                                />
                                <span className={s.filter__option_name}>
                                  {t(item?.$.split(':')[1])}
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )
        })}
      </div>
      {isFiltered && (
        <button type="button" onClick={onClearHandler} className={s.filter__clear}>
          {t('clear_filter')}
        </button>
      )}
    </div>
  )
}
