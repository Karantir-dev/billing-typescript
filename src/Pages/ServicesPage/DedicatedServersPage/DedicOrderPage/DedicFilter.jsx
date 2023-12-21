import { CheckBox } from '@components'
import s from './DedicOrderPage.module.scss'
import { useTranslation } from 'react-i18next'

export default function DedicFilter({
  filtersItems,
  filters,
  setFilters,
  resetChosenTariff,
}) {
  const { t } = useTranslation(['dedicated_servers'])

  return (
    <div className={s.filter}>
      {Object.keys(filters).map(key => {
        return (
          <div key={key} className={s.filter__item}>
            <p className={s.filter__btn}>
              <span className={s.filter__label}>{t(key)}:</span>
            </p>
            <div className={s.filter__option_wrapper}>
              {filtersItems
                ?.filter(el => el.$.includes(`${key}:`))
                .map(item => {
                  return (
                    <div className={s.filter__option} key={item?.$key}>
                      <CheckBox
                        value={filters[key].includes(item?.$key)}
                        onClick={() => {
                          if (filters[key].includes(item?.$key)) {
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
  )
}
