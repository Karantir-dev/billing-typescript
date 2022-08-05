import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './Pagination.module.scss'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { onPageChange, totalCount, currentPage, pageSize, className, onPageItemChange } =
    props

  const { t } = useTranslation('other')

  const [pageNumber, setPageNumber] = useState(currentPage)
  const [itemNumber, setItemNumber] = useState(pageSize)

  useEffect(() => {
    setPageNumber(currentPage)
    setItemNumber(itemNumber)
  }, [currentPage, itemNumber])

  let lastPage = Math.ceil(totalCount / pageSize)

  // if (currentPage === 0 || lastPage < 2) {
  //   return null
  // }

  const onNext = () => {
    onPageChange(currentPage + 1)
    setPageNumber(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
    setPageNumber(currentPage - 1)
  }

  const goToPage = () => {
    onPageChange(Number(pageNumber))
  }

  const changePageItems = () => {
    onPageChange(1)
    onPageItemChange(Number(itemNumber))
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

  return (
    <div className={cn(s.blockPagination, { [className]: className })}>
      <>
        {onPageItemChange && (
          <div className={s.pageItemContainer}>
            <div className={s.servperpage}>{t('Services per page')}:</div>
            <div className={cn(s.paginationItem, s.inputItem)}>
              <input
                className={s.input}
                value={itemNumber}
                onBlur={changePageItems}
                onChange={e => onInputItemsChange(e.target.value)}
              />
            </div>
          </div>
        )}
      </>
      {!(currentPage === 0 || lastPage < 2) && (
        <div className={s.paginationContainer}>
          <div
            className={cn(s.paginationItem, s.arrow, {
              [s.disabled]: currentPage === 1,
            })}
            role="button"
            tabIndex={0}
            disabled={currentPage === 1}
            onClick={onPrevious}
            onKeyDown={null}
          >
            <div className={cn(s.arrow, s.left)} />
          </div>
          <div className={cn(s.paginationItem, s.inputItem)}>
            <input
              className={s.input}
              value={pageNumber}
              onBlur={goToPage}
              onChange={e => onInputChange(e.target.value)}
            />
          </div>
          {t('of')}
          <div className={s.totalPages}>{lastPage}</div>
          <div
            className={cn(s.paginationItem, s.arrow, {
              [s.disabled]: currentPage === lastPage,
            })}
            role="button"
            disabled={currentPage === lastPage}
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
  onPageChange: PropTypes.func,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  totalCount: PropTypes.number,
  totalPrice: PropTypes.number,
  hideExtraInfo: PropTypes.bool,
}

Component.defaultProps = {
  onPageChange: () => null,
}
