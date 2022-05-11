import { createAction } from '@reduxjs/toolkit'

const setPaymentsList = createAction('SET_PAYMENTS_LIST')
const setPaymentsCount = createAction('SET_PAYMENTS_COUNT')

const setPaymentsFiltersLists = createAction('SET_PAYMENTS_FILTERS_LISTS')
const setPaymentsFilters = createAction('SET_PAYMENTS_FILTERS')

const deletePayment = createAction('DELETE_PAYMENT')

const clearPaymentsList = createAction('CLEAR_PAYMENTS_LIST')
const clearPaymentsCount = createAction('CLEAR_PAYMENTS_COUNT')

const setExpensesList = createAction('SET_EXPENSES_LIST')
const setExpensesCount = createAction('SET_EXPENSES_COUNT')

const clearExpensesList = createAction('CLEAR_EXPENSES_LIST')
const clearExpensesCount = createAction('CLEAR_EXPENSES_COUNT')

export default {
  setPaymentsList,
  setPaymentsCount,
  clearPaymentsList,
  clearPaymentsCount,
  deletePayment,

  setExpensesList,
  setExpensesCount,
  clearExpensesList,
  clearExpensesCount,

  setPaymentsFiltersLists,
  setPaymentsFilters,
}
