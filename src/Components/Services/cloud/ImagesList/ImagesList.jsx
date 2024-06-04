/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './ImagesList.module.scss'
import { Icon, Options, Pagination, Select } from '@components'
import cn from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ImageItem from './ImageItem'
import ImageMobileItem from './ImageMobileItem'
export default function ImagesList({
  items,
  cells,
  getItems = () => {},
  itemOnClickHandler,
}) {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })

  const [pagination, setPagination] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { p_num: 1, p_cnt: '10' },
  )

  /* crutch for paginations */
  const [isPaginationChanged, setIsPaginationChanged] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const [sortBy, setSortBy] = useState('+servername')

  useEffect(() => {
    // setFiltersHandler()
    setIsFirstRender(false)

    return () => {
      //   dispatch(cloudVpsActions.setInstancesCount(0))
      //   dispatch(cloudVpsActions.setInstancesList(null))
      //   dispatch(cloudVpsActions.setInstancesFilters({}))
    }
  }, [])

  useEffect(() => {
    if (!isFirstRender) {
      getItems()
    }
  }, [isPaginationChanged])

  const checkSortItem = value => {
    const isActive = sortBy?.replace(/[+-]/g, '') === value
    const isAsc = isActive ? sortBy[0] === '-' : true
    const icon = `Sort_${isAsc ? 'a_z' : 'z_a'}`
    return {
      isActive,
      isAsc,
      icon,
    }
  }

  const setSortValue = p_col => {
    setSortBy(p_col)
    getItems({ p_col })
  }

  const changeSort = value => {
    const { isActive, isAsc } = checkSortItem(value)

    if (isActive && isAsc) {
      setSortValue(`+${value}`)
    } else {
      setSortValue(`-${value}`)
    }
  }
  const renderHeadCells = () =>
    cells
      .filter(cell => !cell.isHidden)
      .map(cell => {
        const { isActive, icon } = checkSortItem(cell.value)
        const changeSortHandler = () => changeSort(cell.value)

        return (
          <th key={cell.label} className={s.th} data-th={cell.label}>
            {cell.isSort ? (
              <button
                className={cn(s.sort, { [s.sort_active]: isActive })}
                onClick={changeSortHandler}
              >
                {t(cell.label)} <Icon name={icon} />
              </button>
            ) : (
              <>{t(cell.label)}</>
            )}
          </th>
        )
      })

  return (
    <div className={s.wrapper}>
      {widerThan768 ? (
        <table className={s.table}>
          <thead className={s.thead}>
            <tr className={s.tr}>
              {renderHeadCells()}
              <th className={s.th}></th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {items.map(item => (
              <ImageItem
                key={item.id}
                item={item}
                cells={cells}
                itemOnClickHandler={itemOnClickHandler}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <Select
            className={s.sort_select}
            placeholder={t('sort')}
            label={`${t('sort')}:`}
            isShadow
            itemsList={cells
              .filter(el => el.isSort)
              .map(el => {
                const { icon } = checkSortItem(el.value)
                return {
                  ...el,
                  label: t(el.label),
                  icon,
                }
              })}
            itemIcon
            getElement={value => changeSort(value)}
            value={sortBy?.replace(/[+-]/g, '')}
            disableClickActive={false}
          />
          <div className={s.mobile__list}>
            {items.map(item => (
              <ImageMobileItem
                key={item.id}
                item={item}
                cells={cells}
                itemOnClickHandler={itemOnClickHandler}
              />
            ))}
            {/* {instances.map(item => (
              <InstanceItemMobile key={item.id.$} item={item} />
            ))} */}
          </div>
        </>
      )}

      {items?.length > 5 && (
        <Pagination
          className={s.pagination}
          currentPage={pagination.p_num}
          totalCount={items.length}
          onPageChange={value => {
            setPagination({ p_num: value })
            setIsPaginationChanged(prev => !prev)
          }}
          pageSize={pagination.p_cnt}
          onPageItemChange={value => {
            setPagination({ p_cnt: value })
          }}
        />
      )}
    </div>
  )
}
