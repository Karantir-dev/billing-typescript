import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import billingActions from './billingActions'

const initialState = {
  paymentsList: [],
  paymentsCount: 0,
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

const billingReducer = combineReducers({
  paymentsList,
  paymentsCount,
})

export default billingReducer
