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

const setExpensesFiltersLists = createAction('SET_EXPENSES_FILTERS_LISTS')
const setExpensesFilters = createAction('SET_EXPENSES_FILTERS')

const clearExpensesList = createAction('CLEAR_EXPENSES_LIST')
const clearExpensesCount = createAction('CLEAR_EXPENSES_COUNT')

const setPaymentMethodsList = createAction('SET_PAYMENT_METHODS_LIST')
const setPaymentCurrencyList = createAction('SET_PAYMENT_CURRENCY_LIST')

const setAutoPaymentsList = createAction('SET_AUTO_PAYMENTS_LIST')
const setAutoPaymentConfig = createAction('SET_AUTO_PAYMENT_CONFIG')
const deleteAutoPayment = createAction('DELETE_AUTO_PAYMENT')

const setPaymentMethodList = createAction('SET_PAYMENT_METHOD_LIST')
const deletePaymentMethod = createAction('DELETE_PAYMENT_METHOD')
const clearPaymentMethodList = createAction('CLEAR_PAYMENT_METHOD_LIST')

const setPaymentMethodCount = createAction('SET_PAYMENT_METHOD_COUNT')
const clearPaymentMethodCount = createAction('CLEAR_PAYMENT_METHOD_COUNT')

const setPeriodValue = createAction('SET_PERIOD_VALUE')

export default {
  setPaymentMethodList,
  deletePaymentMethod,
  clearPaymentMethodList,
  setPaymentMethodCount,
  clearPaymentMethodCount,

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

  setExpensesFiltersLists,
  setExpensesFilters,

  setPaymentMethodsList,
  setPaymentCurrencyList,

  setAutoPaymentsList,
  deleteAutoPayment,
  setAutoPaymentConfig,

  setPeriodValue,
}
