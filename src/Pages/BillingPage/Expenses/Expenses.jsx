import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, BillingFilter, ExpensesTable } from '../../../Components/'
import { Wallet } from '../../../images'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './Expenses.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltered, setIsFiltered] = useState(false)

  const { t } = useTranslation(['billing', 'access_log'])

  const expensesList = useSelector(billingSelectors.getExpensesList)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(billingOperations.getExpenses(data))
  }, [currentPage])

  return (
    <>
      <BillingFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || expensesList?.length > 0}
        setCurrentPage={setCurrentPage}
      />

      {isFiltered && expensesList?.length === 0 && (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {!isFiltered && expensesList?.length === 0 && (
        <div className={s.no_service_wrapper}>
          <Wallet />
          <p className={s.no_service_title}>{t('YOU DO NOT HAVE EXPENSES YET')}</p>
          <p className={s.no_service_description}>
            {t('no services description expenses')}
          </p>
        </div>
      )}

      {expensesList?.length > 0 && <ExpensesTable list={expensesList} />}
      <div className={s.pagination}>
        <Pagination
          currentPage={currentPage}
          totalCount={Number(expensesCount)}
          pageSize={30}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>
    </>
  )
}
