import { CheckBox, Icon } from '@components'
import s from './DedicOrderPage.module.scss'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import cn from 'classnames'

const filterOrder = [
  'gen',
  'cpu',
  'ramtype',
  'ram',
  'drivetype',
  'drive',
  'raid',
  'gpu',
  'port',
  'traffic',
]

export default function DedicFilter({
  filtersItems,
  filters,
  changeFilterHandler,
  clearFiltersHandler,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const [openedCategory, setOpenedCategory] = useState('')
  const renderCategory = new Set([...filterOrder, ...Object.keys(filtersItems)])
  const isFiltered = Object.values(filters).some(filter => filter.length)

  return (
    <div className={s.filter__wrapper}>
      <div className={s.filter}>
        {[...renderCategory]
          .filter(category => filtersItems[category]?.some(el => el.available))
          .map(category => {
            const isOpened = openedCategory === category

            return (
              <div
                key={category}
                className={cn(s.filter__item, { [s.opened]: isOpened })}
              >
                <button
                  className={s.filter__btn}
                  onClick={() => setOpenedCategory(isOpened ? '' : category)}
                  type="button"
                >
                  <span className={s.filter__label}>{t(category)}</span>
                  {!!filters?.[category]?.length && (
                    <span className={s.filter_amount}>{filters[category].length}</span>
                  )}

                  <Icon name="ArrowSign" className={s.filter__btn_icon} />
                </button>
                <div className={s.filter__option_wrapper}>
                  {filtersItems?.[category]
                    ?.filter(item => item.available)
                    .map(item => {
                      return (
                        <div className={s.filter__option} key={item?.$key}>
                          <CheckBox
                            value={filters?.[category]?.includes(item?.$key)}
                            onClick={() => changeFilterHandler(item?.$key, category)}
                            disabled={!item.available}
                          />
                          <span className={s.filter__option_name}>
                            {t(item?.$.split(':')[1])}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
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
