/* eslint-disable no-unused-vars */
import { CheckBox, Icon, InputRange } from '@components'
import s from './DedicOrderPage.module.scss'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import cn from 'classnames'

const filterOrder = ['gen', 'cpu', 'ram', 'drive', 'raid', 'gpu', 'traffic', 'rate']
const filtersGroups = ['cpu', 'ram', 'drive']

export default function DedicFilter({
  filtersItems,
  filters,
  changeFilterHandler,
  clearFiltersHandler,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const [openedCategory, setOpenedCategory] = useState('')
  const [secondOpenedCategory, setSecondOpenedCategory] = useState('')
  const renderCategory = new Set([...filterOrder, ...Object.keys(filtersItems)])

  const coresAvailable = filtersItems.cpucores
    ?.filter(el => el.available)
    .map(el => el.$.replace(/\D/g, ''))

    const filtersCategories = useMemo(
    () =>
      [...renderCategory].reduce((acc, el) => {
        const key = filtersGroups.find(group => el.includes(group)) || el
        acc[key] = [...(acc[key] || []), el]
        return acc
      }, {}),
    [filtersItems],
  )

  const isFiltered = Object.values(filters).some(filter => filter.length)

  return (
    <div className={s.filter__wrapper}>
      <div className={s.filter}>
        {[...renderCategory]?.map(category => {
          const isOpened = openedCategory === category

          const categoryItems = filtersCategories[category]?.reduce(
            (acc, el) => {
              acc.count += filters[el]?.length
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
                        {/* {group === 'cpucores' && (
                          <InputRange
                            min={coresAvailable[0]}
                            max={coresAvailable[coresAvailable.length - 1]}
                            defaultValue={[
                              coresAvailable[0],
                              coresAvailable[coresAvailable.length - 1],
                            ]}
                            // value={[
                            //   coresAvailable[0],
                            //   coresAvailable[coresAvailable.length - 1],
                            // ]}
                            onInput={e => console.log(e, 'e')}
                            onThumbDragEnd={value =>
                              console.log(value, ' onThumbDragEnd')
                            }
                            rangeSlideDisabled
                            step={2}
                          />
                        )} */}
                        {filtersItems?.[group]
                          ?.filter(item => item.available)
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
                          ))}
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
        <button
          type="button"
          onClick={() => {
            clearFiltersHandler()
            setOpenedCategory('')
          }}
          className={s.filter__clear}
        >
          {t('clear_filter')}
        </button>
      )}
    </div>
  )
}
