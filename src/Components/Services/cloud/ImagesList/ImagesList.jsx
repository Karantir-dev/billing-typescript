import { useTranslation } from 'react-i18next'
import s from './ImagesList.module.scss'
import {
  EditCell,
  Icon,
  ImagesOptions,
  Pagination,
  Select,
  TooltipWrapper,
} from '@components'
import cn from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ImageItem from './ImageItem'
import ImageMobileItem from './ImageMobileItem'
import { formatCountryName, getFlagFromCountryName } from '@src/utils'
import PropTypes from 'prop-types'

export default function ImagesList({
  items,
  itemsCount,
  cells,
  getItems,
  editImage,
  itemOnClickHandler,
  idKey = 'id',
  type,
  cost,
}) {
  const { t } = useTranslation(['cloud_vps', 'countries'])
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

  const [sortBy, setSortBy] = useState(`+${idKey}`)

  const getItemsHandler = ({ p_col, p_num, p_cnt } = {}) => {
    getItems({
      p_col,
      p_cnt: p_cnt ?? pagination.p_cnt,
      p_num: p_num ?? pagination.p_num,
    })
  }

  useEffect(() => {
    getItemsHandler({ p_col: sortBy })
    setIsFirstRender(false)
  }, [])

  useEffect(() => {
    if (!isFirstRender) {
      getItemsHandler()
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
    getItemsHandler({ p_col })
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

  const renderCells = cells.map(cell => {
    let renderData
    switch (cell.label) {
      case 'name':
        if (!cell.renderData) {
          renderData = function renderData(value, item) {
            return (
              <div className={s.name_wrapper}>
                <div className={s.name_field_wrapper}>
                  {item?.protected?.$orig === 'on' && <Icon name="Protected" />}
                  <div className={s.name_field}>
                    <EditCell
                      originName={value}
                      onSubmit={value => {
                        const name = value.trim()
                        if (value) {
                          editImage({ id: item[idKey].$, name })
                        }
                      }}
                      placeholder={value || t('server_placeholder', { ns: 'vds' })}
                      isShadow={true}
                    />
                  </div>
                </div>
                {item.fleio_status?.$ && (
                  <p
                    className={cn(
                      s.status,
                      s[item?.fleio_status?.$?.trim().toLowerCase()],
                    )}
                  >
                    {item.fleio_status?.$}
                  </p>
                )}
              </div>
            )
          }
          return { ...cell, renderData }
        }
        return cell
      case 'options':
        if (!cell.renderData) {
          renderData = function renderData(_, item) {
            return <ImagesOptions item={item} type={type} idKey={idKey} />
          }
          return { ...cell, renderData }
        }
        return cell
      case 'os':
        if (!cell.renderData) {
          renderData = function renderData(value, item) {
            return (
              <TooltipWrapper
                className={s.popup}
                wrapperClassName={s.popup__wrapper}
                content={value}
                anchor={`os_${item?.[idKey].$}`}
              >
                <Icon name={value} />
              </TooltipWrapper>
            )
          }
          return { ...cell, renderData }
        }
        return cell
      case 'price_per_day':
        if (!cell.renderData) {
          renderData = function renderData(_, item) {
            const sizeCell = cells.find(el => el.label === 'size')

            return item[sizeCell?.value]?.$
              ? `€${Math.ceil(item[sizeCell?.value]?.$) * cost}`
              : ''
          }
          return { ...cell, renderData }
        }
        return cell
      case 'size':
        if (!cell.renderData) {
          renderData = function renderData(value) {
            return value ? `${value} GB` : ''
          }
          return { ...cell, renderData }
        }
        return cell
      case 'region':
        if (!cell.renderData) {
          renderData = function renderData(value, item) {
            const itemCountry = formatCountryName(item, 'region')
            return (
              <TooltipWrapper
                className={s.popup}
                wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
                content={t(itemCountry, { ns: 'countries' })}
                anchor={`country_flag_${item?.[idKey].$}`}
              >
                {itemCountry ? (
                  <img
                    src={require(
                      `@images/countryFlags/${getFlagFromCountryName(itemCountry)}.png`,
                    )}
                    width={20}
                    height={14}
                    alt={value}
                  />
                ) : (
                  'undefined'
                )}
              </TooltipWrapper>
            )
          }
          return { ...cell, renderData }
        }
        return cell
      default:
        return cell
    }
  })

  return (
    <>
      {items && (
        <>
          {items.length ? (
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
                        key={item?.[idKey].$}
                        item={item}
                        cells={renderCells}
                        itemOnClickHandler={itemOnClickHandler}
                        idKey={idKey}
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
                    {items.map(item => {
                      return (
                        <ImageMobileItem
                          key={item?.[idKey].$}
                          item={item}
                          cells={renderCells}
                          itemOnClickHandler={itemOnClickHandler}
                          idKey={idKey}
                        />
                      )
                    })}
                  </div>
                </>
              )}

              {itemsCount > 5 && (
                <Pagination
                  className={s.pagination}
                  currentPage={pagination.p_num}
                  totalCount={itemsCount}
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
          ) : (
            <div className={s.no_images_wrapper}>
              <p className={s.no_images_title}>{t('empty_list')}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

ImagesList.propTypes = {
  items: PropTypes.array,
  itemsCount: PropTypes.number,
  cells: PropTypes.array,
  getItems: PropTypes.func,
  editImage: PropTypes.func,
  itemOnClickHandler: PropTypes.func,
  idKey: PropTypes.string,
  type: PropTypes.string,
}
