import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, BillingFilter, ExpensesTable, Icon, Loader } from '@components'
import { billingOperations, billingSelectors } from '@redux'
import s from './Expenses.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [isFiltered, setIsFiltered] = useState(false)

  const [firstOpen, setFirstOpen] = useState(true)

  const { t } = useTranslation(['billing', 'access_log'])

  const expensesList = useSelector(billingSelectors.getExpensesList)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)

  useEffect(() => {
    if (!firstOpen) {
      const data = { p_num, p_cnt }
      dispatch(billingOperations.getExpenses(data, signal, setIsLoading))
    }
    setFirstOpen(false)
  }, [p_num, p_cnt])

  return (
    <>
      <BillingFilter
        p_cnt={p_cnt}
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || expensesList?.length > 0}
        setCurrentPage={setP_num}
        isLoading={isLoading}
        signal={signal}
        setIsLoading={setIsLoading}
      />
      <div style={{ display: isLoading ? 'none' : '' }}>
        {isFiltered && expensesList?.length === 0 && (
          <div className={s.no_results_wrapper}>
            <p className={s.no_results_text}>
              {t('nothing_found', { ns: 'access_log' })}
            </p>
          </div>
        )}

        {!isFiltered && expensesList?.length === 0 && (
          <div className={s.no_service_wrapper}>
            <Icon name="Wallet" />
            <p className={s.no_service_title}>{t('YOU DO NOT HAVE EXPENSES YET')}</p>
            <p className={s.no_service_description}>
              {t('no services description expenses')}
            </p>
          </div>
        )}

        {expensesList?.length > 0 && <ExpensesTable list={expensesList} />}

        {expensesList?.length > 0 && expensesCount > 5 && (
          <div className={s.pagination}>
            <Pagination
              totalCount={Number(expensesCount)}
              currentPage={p_num}
              pageSize={p_cnt}
              onPageChange={page => setP_num(page)}
              onPageItemChange={items => setP_cnt(items)}
              paginationItemClassName={s.pagination__item}
            />
          </div>
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} transparent staticPos />}
    </>
  )
}
