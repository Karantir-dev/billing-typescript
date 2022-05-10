import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useTranslation } from 'react-i18next'
import { Pagination, BillingFilter } from '../../../Components/'
import s from './Payments.module.scss'

export default function Component() {
  //   const dispatch = useDispatch()
  //   const { t } = useTranslation(['billing', 'other'])

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {}, [])

  useEffect(() => {}, [currentPage])

  return (
    <>
      <div className={s.pagination}>
        <BillingFilter />
        <Pagination
          currentPage={currentPage}
          totalCount={Number(0)}
          pageSize={30}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>
    </>
  )
}
