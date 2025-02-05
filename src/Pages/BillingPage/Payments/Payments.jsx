import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, BillingFilter, PaymentsTable, Icon, Loader } from '@components'
import { billingOperations, billingSelectors } from '@redux'
import s from './Payments.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()

  const paymentsList = useSelector(billingSelectors.getPaymentsList)
  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [isFiltered, setIsFiltered] = useState(false)

  const [firstOpen, setFirstOpen] = useState(true)

  const [createPaymentModal, setCreatePaymentModal] = useState(false)

  const { t } = useTranslation(['billing', 'access_log'])

  useEffect(() => {
    if (!firstOpen) {
      const data = { p_num, p_cnt }
      dispatch(billingOperations.getPayments(data, false, signal, setIsLoading))
    }

    setFirstOpen(false)
  }, [p_num, p_cnt])

  const payHandler = (id, name, paymethod) => {
    dispatch(billingOperations.getPaymentRedirect(id, name, paymethod))
  }

  const downloadPdfHandler = (id, name) => {
    dispatch(billingOperations.getPaymentPdf(id, name, signal, setIsLoading))
  }

  const deletePayment = id => {
    dispatch(billingOperations.deletePayment(id))
  }

  return (
    <>
      <BillingFilter
        isFiltered={isFiltered}
        p_cnt={p_cnt}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || paymentsList?.length > 0}
        setCurrentPage={setP_num}
        downloadPdfHandler={downloadPdfHandler}
        setCreatePaymentModal={setCreatePaymentModal}
        createPaymentModal={createPaymentModal}
        signal={signal}
        setIsLoading={setIsLoading}
      />
      {isFiltered && paymentsList?.length === 0 && (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {!isFiltered && paymentsList?.length === 0 && (
        <div className={s.no_service_wrapper}>
          <Icon name="Wallet" />
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
          setCreatePaymentModal={setCreatePaymentModal}
        />
      )}

      {paymentsList?.length > 0 && paymentsCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(paymentsCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => setP_num(page)}
            onPageItemChange={items => setP_cnt(items)}
            paginationItemClassName={s.pagination__item}
          />
        </div>
      )}
      {isLoading && <Loader local halfScreen shown={isLoading} />}
    </>
  )
}
