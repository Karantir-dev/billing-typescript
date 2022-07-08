import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, BillingFilter, ExpensesTable } from '../../../Components/'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './Expenses.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)

  const expensesList = useSelector(billingSelectors.getExpensesList)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(billingOperations.getExpenses(data))
  }, [currentPage])

  return (
    <>
      <BillingFilter />
      <ExpensesTable list={expensesList} />
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
