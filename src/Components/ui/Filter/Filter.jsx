import { useState, useRef, useMemo, useEffect } from 'react'
import { useOutsideAlerter } from '@utils'
import { IconButton } from '@components'
import cn from 'classnames'
import s from './Filter.module.scss'
import FilterModal from './FilterModal'

export default function Filter({ filters, fields, setFiltersHandler, itemsCount }) {
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

  const isFiltered = !!Object.values(filterState).filter(el => el).length
  useOutsideAlerter(modal, isFiltersOpened, closeFilterModal)

  return (
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
  )
}
