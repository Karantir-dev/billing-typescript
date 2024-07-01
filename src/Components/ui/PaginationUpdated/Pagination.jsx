import { useEffect, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './Pagination.module.scss'
import { useTranslation } from 'react-i18next'

export default function Component({
  className,
  paginationItemClassName,
  getItemsHandler,
  pagination,
}) {
  const { t } = useTranslation('other')

  const [pageNumber, setPageNumber] = useState(pagination.p_num)
  const [itemNumber, setItemNumber] = useState(pagination.p_cnt)
  const lastPage = Math.ceil(pagination.p_elems / pagination.p_cnt)

  useEffect(() => {
    if (pagination.p_num > lastPage) {
      getItemsHandler({ p_num: lastPage })
      return
    }
    setPageNumber(pagination.p_num)
    setItemNumber(pagination.p_cnt)
  }, [pagination])

  const onNext = () => {
    getItemsHandler({ p_num: pageNumber + 1 })
    setPageNumber(prev => prev + 1)
  }

  const onPrevious = () => {
    getItemsHandler({ p_num: pageNumber - 1 })
    setPageNumber(prev => prev - 1)
  }

  const goToPage = () => {
    if (pagination.p_num === +pageNumber) return
    getItemsHandler({ p_num: pageNumber })
    setPageNumber(pageNumber)
  }

  const changePageItems = () => {
    if (+itemNumber === pagination.p_cnt) return
    setPageNumber(1)
    if (itemNumber < 5) {
      getItemsHandler({ p_num: 1, p_cnt: 5 })
      setItemNumber(5)
      return
    } else {
      getItemsHandler({ p_num: 1, p_cnt: itemNumber })
      setItemNumber(itemNumber)
    }
  }

  const onInputChange = text => {
    let value = text.replace(/\D/g, '')
    if (value.length === 0) {
      value = ''
    }
    if (Number(value) < 1 && value.length !== 0) {
      value = 1
    }
    if (Number(value) > lastPage) {
      value = lastPage
    }

    setPageNumber(value)
  }

  const onInputItemsChange = text => {
    let value = text.replace(/\D/g, '')
    if (value.length === 0) {
      value = ''
    }
    setItemNumber(value)
  }

  const onPressEnter = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event?.target?.blur()
    }
  }

  if (!pagination.p_elems || pagination.p_elems <= 5) {
    return null
  }

  return (
    <div className={cn(s.blockPagination, { [className]: className })}>
      <>
        <div className={s.pageItemContainer}>
          <div className={s.servperpage}>{t('Services per page')}:</div>
          <div className={cn(s.paginationItem, s.inputItem, paginationItemClassName)}>
            <input
              className={s.input}
              onKeyDown={onPressEnter}
              value={itemNumber}
              onBlur={changePageItems}
              onChange={e => onInputItemsChange(e.target.value)}
            />
          </div>
        </div>
      </>
      {!(pageNumber === 0 || lastPage < 2) && (
        <div className={s.paginationContainer}>
          <div
            className={cn(s.paginationItem, s.arrow, {
              [s.disabled]: pageNumber === 1,
            })}
            role="button"
            tabIndex={0}
            disabled={pageNumber === 1}
            onClick={onPrevious}
            onKeyDown={null}
          >
            <div className={cn(s.arrow, s.left)} />
          </div>
          <div className={cn(s.paginationItem, s.inputItem, paginationItemClassName)}>
            <input
              className={s.input}
              onKeyDown={onPressEnter}
              value={pageNumber}
              onBlur={goToPage}
              onChange={e => onInputChange(e.target.value)}
            />
          </div>
          {t('of')}
          <div className={s.totalPages}>{lastPage}</div>
          <div
            className={cn(s.paginationItem, s.arrow, {
              [s.disabled]: pageNumber >= lastPage,
            })}
            role="button"
            disabled={pageNumber >= lastPage}
            tabIndex={0}
            onClick={onNext}
            onKeyDown={null}
          >
            <div className={cn(s.arrow, s.right)} />
          </div>
        </div>
      )}
    </div>
  )
}

Component.propTypes = {
  className: PropTypes.string,
  getItemsHandler: PropTypes.func,
  pagination: PropTypes.object,
}
