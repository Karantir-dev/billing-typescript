import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { usePagination, DOTS } from './usePagination'
import s from './Pagination.module.scss'

export default function Component(props) {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <ul className={cn(s.paginationContainer, { [className]: className })}>
      <div
        className={cn(s.paginationItem, {
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
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return (
            <div key={pageNumber} className={cn(s.paginationItem, s.dots)}>
              &#8230;
            </div>
          )
        }

        return (
          <div
            key={pageNumber}
            className={cn(s.paginationItem, {
              [s.selected]: pageNumber === currentPage,
            })}
            role="button"
            tabIndex={0}
            onClick={() => onPageChange(pageNumber)}
            onKeyDown={null}
          >
            {pageNumber}
          </div>
        )
      })}
      <div
        className={cn(s.paginationItem, {
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
    </ul>
  )
}



Component.propTypes = {
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  pageSize:  PropTypes.number,
  currentPage:  PropTypes.number,
  siblingCount: PropTypes.number,
  totalCount: PropTypes.number,
}

Component.defaultProps = {
  onPageChange: () => null,
  siblingCount: 1
}
