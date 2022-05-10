import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useTranslation } from 'react-i18next'
import { Pagination, BillingFilter } from '../../../Components/'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './Payments.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  //   const { t } = useTranslation(['billing', 'other'])

  const paymentsList = useSelector(billingSelectors.getPaymentsList)
  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)

  console.log(paymentsList)

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(billingOperations.getPayments())
  }, [])

  useEffect(() => {}, [currentPage])

  return (
    <>
      <BillingFilter />
      <div className={s.pagination}>
        <Pagination
          currentPage={currentPage}
          totalCount={Number(paymentsCount)}
          pageSize={30}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>
    </>
  )
}
