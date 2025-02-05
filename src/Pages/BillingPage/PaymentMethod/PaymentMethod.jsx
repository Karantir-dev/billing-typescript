import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Pagination,
  PaymentsMethodsTable,
  ModalCreatePaymentMethod,
  Icon,
  Loader,
} from '@components'
import { billingOperations, billingSelectors } from '@redux'
import s from './PaymentMethod.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()
  const isStripeAvailable = useSelector(billingSelectors.getIsStripeAvailable)

  let paymentsList = useSelector(billingSelectors.getPaymentMethodList)
  const paymentsCount = useSelector(billingSelectors.getPaymentMethodCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [createPaymentModal, setCreatePaymentModal] = useState(false)

  const { t } = useTranslation(['billing', 'access_log', 'payers'])

  const getPageData = () => {
    const data = { p_num, p_cnt }
    dispatch(billingOperations.getPaymentMethods(data, signal, setIsLoading))
  }

  useEffect(() => {
    getPageData()
  }, [p_num, p_cnt])

  const reconfigHandler = (elid, elname) => {
    dispatch(billingOperations.getPaymentMethodReconfig(elid, elname))
  }

  const deleteItemHandler = elid => {
    dispatch(billingOperations.deletePaymentMethod(elid))
  }

  const editItemNameHandler = (elid, customname) => {
    dispatch(billingOperations.editNamePaymentMethod({ elid, customname }, getPageData))
  }

  return (
    <>
      {paymentsList?.length === 0 && (
        <div className={s.no_service_wrapper}>
          <Icon name="Wallet" />
          <p className={s.no_service_title}>{t('YOU DO NOT HAVE PAYMENT METHODS YET')}</p>
          <p className={s.no_service_description}>{t('no services description')}</p>
        </div>
      )}

      {paymentsList?.length > 0 && (
        <PaymentsMethodsTable
          reconfigHandler={reconfigHandler}
          deleteItemHandler={deleteItemHandler}
          list={paymentsList}
          editItemNameHandler={editItemNameHandler}
        />
      )}
      {isStripeAvailable && (
        <div className={s.addBtn}>
          <Button
            isShadow
            label={t('Add', { ns: 'payers' })}
            onClick={() => setCreatePaymentModal(!createPaymentModal)}
          />
        </div>
      )}

      {paymentsList?.length > 0 && paymentsCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(paymentsCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => setP_num(page)}
            onPageItemChange={items => setP_cnt(items)}
          />
        </div>
      )}

      {createPaymentModal && (
        <ModalCreatePaymentMethod setCreatePaymentModal={setCreatePaymentModal} />
      )}
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
