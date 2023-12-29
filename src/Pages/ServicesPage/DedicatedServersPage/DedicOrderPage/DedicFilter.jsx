import { CheckBox, Icon } from '@components'
import s from './DedicOrderPage.module.scss'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import cn from 'classnames'

export default function DedicFilter({
  filtersItems,
  filters,
  setFilters,
  resetChosenTariff,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const [openedCategory, setOpenedCategory] = useState('')

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
  ]

  const isFiltered = Object.values(filters).some(filter => filter.length)

  return (
    <div className={s.filter__wrapper}>
      <div className={s.filter}>
        {filterOrder.map(key => {
          const isOpened = openedCategory === key

          return (
            <div key={key} className={cn(s.filter__item, { [s.opened]: isOpened })}>
              <button
                className={s.filter__btn}
                onClick={() => setOpenedCategory(isOpened ? '' : key)}
                type="button"
              >
                <span className={s.filter__label}>{t(key)}</span>
                {!!filters?.[key]?.length && (
                  <span className={s.filter_amount}>{filters[key].length}</span>
                )}

                <Icon name="ArrowSign" className={s.filter__btn_icon} />
              </button>
              <div className={s.filter__option_wrapper}>
                {filtersItems
                  ?.filter(el => el.$.includes(`${key}:`))
                  .map(item => {
                    return (
                      <div className={s.filter__option} key={item?.$key}>
                        <CheckBox
                          value={filters?.[key]?.includes(item?.$key)}
                          onClick={() => {
                            if (filters?.[key]?.includes(item?.$key)) {
                              setFilters({ type: 'remove', key: [key], value: item.$key })
                            } else {
                              setFilters({ type: 'add', key: [key], value: item.$key })
                            }
                            resetChosenTariff()
                          }}
                        />
                        <span className={s.filter__option_name}>
                          {item?.$.split(':')[1]}
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
            setFilters({ type: 'clear_filter' })
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
