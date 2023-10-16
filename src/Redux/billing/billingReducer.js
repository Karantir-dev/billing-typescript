import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import billingActions from './billingActions'

const initialState = {
  paymentsList: null,
  paymentsCount: 0,
  expensesList: null,
  expensesCount: 0,
  paymentsReadOnlyList: null,
  paymentsReadOnlyCount: 0,
  paymentMethodList: null,
  paymentMethodCount: 0,

  paymentsFiltersList: null,
  paymentsFilters: null,

  expensesFiltersList: null,
  expensesFilters: null,

  paymentsMethodList: null,
  paymentsCurrencyList: null,

  autoPaymentsList: [],
  autoPaymentConfig: null,

  periodValue: null,
  isStripeAvailable: false,
  isModalCreatePaymentOpened: false,
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

const paymentsReadOnlyList = createReducer(initialState.paymentsReadOnlyList, {
  [billingActions.setPaymentsReadOnlyList]: (_, { payload }) => payload,
  [billingActions.clearPaymentsReadOnlyList]: () => [],
})

const paymentsReadOnlyCount = createReducer(initialState.paymentsReadOnlyCount, {
  [billingActions.setPaymentsReadOnlyCount]: (_, { payload }) => payload,
  [billingActions.clearPaymentsReadOnlyCount]: () => 0,
})

const paymentMethodList = createReducer(initialState.paymentMethodList, {
  [billingActions.setPaymentMethodList]: (_, { payload }) => payload,
  [billingActions.deletePaymentMethod]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.recurring?.$ !== payload)),
  [billingActions.clearPaymentMethodList]: () => [],
})

const paymentsMethodCount = createReducer(initialState.paymentMethodCount, {
  [billingActions.setPaymentMethodCount]: (_, { payload }) => payload,
  [billingActions.clearPaymentMethodCount]: () => 0,
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

const periodValue = createReducer(initialState.periodValue, {
  [billingActions.setPeriodValue]: (_, { payload }) => payload,
})
const isStripeAvailable = createReducer(initialState.isStripeAvailable, {
  [billingActions.setIsStripeAvailable]: (_, { payload }) => payload,
})

const isModalCreatePaymentOpened = createReducer(
  initialState.isModalCreatePaymentOpened,
  {
    [billingActions.setIsModalCreatePaymentOpened]: (_, { payload }) => payload,
  },
)

const billingReducer = combineReducers({
  paymentsList,
  paymentsCount,
  expensesList,
  expensesCount,
  paymentsReadOnlyList,
  paymentsReadOnlyCount,

  paymentsFiltersList,
  paymentsFilters,

  expensesFiltersList,
  expensesFilters,

  paymentsMethodList,
  paymentsCurrencyList,

  autoPaymentsList,
  autoPaymentConfig,

  paymentsMethodCount,
  paymentMethodList,

  periodValue,
  isStripeAvailable,
  isModalCreatePaymentOpened,
})

export default billingReducer
