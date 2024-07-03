import { useState, useRef, useMemo, useEffect } from 'react'
import { useOutsideAlerter } from '@utils'
import { Icon, IconButton } from '@components'
import cn from 'classnames'
import s from './Filter.module.scss'
import FilterModal from './FilterModal'
import { useTranslation } from 'react-i18next'

export default function Filter({
  filters,
  fields,
  setFiltersHandler,
  itemsCount,
  cloudsClassName,
}) {
  const { t } = useTranslation(['filter'])

  const [isFiltersOpened, setIsFiltersOpened] = useState(false)

  const closeFilterModal = () => setIsFiltersOpened(false)
  const modal = useRef(null)

  const clearFilterValues = useMemo(() => {
    return fields.reduce((res, { value }) => {
      res[value] = ''
      return res
    }, {})
  }, [fields])

  const filterState = useMemo(() => {
    return fields.reduce((res, field) => {
      res[field.value] = filters[field.value]?.$ || ''
      return res
    }, {})
  }, [filters])

  useEffect(() => {
    setFiltersHandler(clearFilterValues, 'first')
  }, [])

  const activeFilters = Object.keys(filterState).filter(key => filterState[key])

  const isFiltered = !!activeFilters.length
  useOutsideAlerter(modal, isFiltersOpened, closeFilterModal)

  return (
    <>
      <div className={s.filter}>
        <IconButton
          className={cn(s.filter__icon, { [s.filtered]: isFiltered })}
          onClick={() => setIsFiltersOpened(true)}
          icon="filter"
          disabled={!itemsCount && !isFiltered}
        />

        {isFiltersOpened && (
          <FilterModal
            isFiltersOpened
            filterState={filterState}
            closeFilterModal={closeFilterModal}
            setFiltersHandler={setFiltersHandler}
            clearFilterValues={clearFilterValues}
            isFiltered={isFiltered}
            fields={fields}
            ref={modal}
          />
        )}
      </div>
      {isFiltered && (
        <ul className={cn(s.filter__clouds, cloudsClassName)}>
          {activeFilters.map(key => {
            const value = filterState[key]
            const label = fields.find(field => field.value === key)?.label

            return (
              <li key={key} className={s.filter__cloud}>
                <span className={s.filter__cloud_name}>{t(label)}:</span>
                <span className={s.filter__cloud_value}>{value.trim()}</span>
                <button
                  className={s.filter__cloud_btn}
                  onClick={() => {
                    setFiltersHandler({ ...filterState, [key]: '' })
                  }}
                >
                  <Icon name="Cross" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
