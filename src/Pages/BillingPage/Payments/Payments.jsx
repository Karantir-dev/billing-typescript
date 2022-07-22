import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, BillingFilter, PaymentsTable } from '../../../Components/'
import { Wallet } from '../../../images'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './Payments.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  let paymentsList = useSelector(billingSelectors.getPaymentsList)
  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltered, setIsFiltered] = useState(false)
  const { t } = useTranslation(['billing', 'access_log'])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(billingOperations.getPayments(data))
  }, [currentPage])

  const payHandler = (id, name) => {
    dispatch(billingOperations.getPaymentRedirect(id, name))
  }

  const downloadPdfHandler = (id, name) => {
    dispatch(billingOperations.getPaymentPdf(id, name))
  }

  const deletePayment = id => {
    dispatch(billingOperations.deletePayment(id))
  }

  return (
    <>
      <BillingFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || paymentsList?.length > 0}
        setCurrentPage={setCurrentPage}
        downloadPdfHandler={downloadPdfHandler}
      />

      {isFiltered && paymentsList?.length === 0 && (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {!isFiltered && paymentsList?.length === 0 && (
        <div className={s.no_service_wrapper}>
          <Wallet />
          <p className={s.no_service_title}>{t('YOU DO NOT HAVE PAYMENTS YET')}</p>
          <p className={s.no_service_description}>{t('no services description')}</p>
        </div>
      )}

      {paymentsList?.length > 0 && (
        <PaymentsTable
          list={paymentsList}
          downloadPdfHandler={downloadPdfHandler}
          deletePayment={deletePayment}
          payHandler={payHandler}
        />
      )}
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
