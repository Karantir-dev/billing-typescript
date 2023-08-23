import { createAction } from '@reduxjs/toolkit'

const setForexList = createAction('SET_FOREX_LIST')
const setForexCount = createAction('SET_FOREX_COUNT')

export default {
  setForexList,
  setForexCount,
}
