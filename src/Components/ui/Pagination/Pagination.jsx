import React, { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './Pagination.module.scss'

export default function Component(props) {
  const { onPageChange, totalCount, currentPage, pageSize, className } = props

  const [pageNumber, setPageNumber] = useState(currentPage)

  let lastPage = Math.ceil(totalCount / pageSize)

  if (currentPage === 0 || lastPage < 2) {
    return null
  }

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

  return (
    <div className={cn(s.blockPagination, { [className]: className })}>
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
        <div className={s.paginationItem}>
          <input
            className={s.input}
            value={pageNumber}
            onChange={e => onInputChange(e.target.value)}
          />
        </div>
        из
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
      <button onClick={goToPage} className={s.btn}>
        перейти
      </button>
    </div>
  )
}

Component.propTypes = {
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  siblingCount: PropTypes.number,
  totalCount: PropTypes.number,
}

Component.defaultProps = {
  onPageChange: () => null,
  siblingCount: 1,
}
