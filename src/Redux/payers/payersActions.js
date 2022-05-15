import { createAction } from '@reduxjs/toolkit'

const setPayersList = createAction('SET_PAYERS_LIST')
const setPayersCount = createAction('SET_PAYERS_COUNT')

const deletePayer = createAction('DELETE_PAYER')

export default {
  setPayersList,
  setPayersCount,
  deletePayer,
}
