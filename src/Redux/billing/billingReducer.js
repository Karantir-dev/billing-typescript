import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import billingActions from './billingActions'

const initialState = {
  paymentsList: [],
  paymentsCount: 0,
  expensesList: [],
  expensesCount: 0,

  paymentsFiltersList: null,
  paymentsFilters: null,
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

const billingReducer = combineReducers({
  paymentsList,
  paymentsCount,
  expensesList,
  expensesCount,

  paymentsFiltersList,
  paymentsFilters,
})

export default billingReducer
