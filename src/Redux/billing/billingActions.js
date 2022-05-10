import { createAction } from '@reduxjs/toolkit'

const setPaymentsList = createAction('SET_PAYMENTS_LIST')
const setPaymentsCount = createAction('SET_PAYMENTS_COUNT')

const deletePayment = createAction('DELETE_PAYMENT')

const clearPaymentsList = createAction('CLEAR_PAYMENTS_LIST')
const clearPaymentsCount = createAction('CLEAR_PAYMENTS_COUNT')

export default {
  setPaymentsList,
  setPaymentsCount,
  clearPaymentsList,
  clearPaymentsCount,
  deletePayment,
}
