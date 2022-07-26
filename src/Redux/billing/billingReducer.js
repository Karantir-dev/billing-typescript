import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import billingActions from './billingActions'

const initialState = {
  paymentsList: null,
  paymentsCount: 0,
  expensesList: null,
  expensesCount: 0,

  paymentsFiltersList: null,
  paymentsFilters: null,

  expensesFiltersList: null,
  expensesFilters: null,

  paymentsMethodList: null,
  paymentsCurrencyList: null,

  autoPaymentsList: [],
  autoPaymentConfig: null,
}

const paymentsList = createReducer(initialState.paymentsList, {
  [billingActions.setPaymentsList]: (_, { payload }) => payload,
  [billingActions.deletePayment]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
  [billingActions.clearPaymentsList]: () => [],
})

const paymentsCount = createReducer(initialState.paymentsCount, {
  [billingActions.setPaymentsCount]: (_, { payload }) => payload,
  [billingActions.clearPaymentsCount]: () => 0,
})

const expensesList = createReducer(initialState.expensesList, {
  [billingActions.setExpensesList]: (_, { payload }) => payload,
  [billingActions.clearExpensesList]: () => [],
})

const expensesCount = createReducer(initialState.expensesCount, {
  [billingActions.setExpensesCount]: (_, { payload }) => payload,
  [billingActions.clearExpensesCount]: () => 0,
})

const paymentsFiltersList = createReducer(initialState.paymentsFiltersList, {
  [billingActions.setPaymentsFiltersLists]: (_, { payload }) => payload,
})

const paymentsFilters = createReducer(initialState.paymentsFilters, {
  [billingActions.setPaymentsFilters]: (_, { payload }) => payload,
})

const expensesFiltersList = createReducer(initialState.expensesFiltersList, {
  [billingActions.setExpensesFiltersLists]: (_, { payload }) => payload,
})

const expensesFilters = createReducer(initialState.expensesFilters, {
  [billingActions.setExpensesFilters]: (_, { payload }) => payload,
})

const paymentsMethodList = createReducer(initialState.paymentsMethodList, {
  [billingActions.setPaymentMethodsList]: (_, { payload }) => payload,
})

const paymentsCurrencyList = createReducer(initialState.paymentsCurrencyList, {
  [billingActions.setPaymentCurrencyList]: (_, { payload }) => payload,
})

const autoPaymentsList = createReducer(initialState.autoPaymentsList, {
  [billingActions.setAutoPaymentsList]: (_, { payload }) => payload,
  [billingActions.deleteAutoPayment]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const autoPaymentConfig = createReducer(initialState.autoPaymentConfig, {
  [billingActions.setAutoPaymentConfig]: (_, { payload }) => payload,
})

const billingReducer = combineReducers({
  paymentsList,
  paymentsCount,
  expensesList,
  expensesCount,

  paymentsFiltersList,
  paymentsFilters,

  expensesFiltersList,
  expensesFilters,

  paymentsMethodList,
  paymentsCurrencyList,

  autoPaymentsList,
  autoPaymentConfig,
})

export default billingReducer
