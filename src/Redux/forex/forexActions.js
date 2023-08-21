import { createAction } from '@reduxjs/toolkit'

const setForexList = createAction('SET_FOREX_LIST')
const setForexCount = createAction('SET_FOREX_COUNT')

const showLoader = createAction('SHOW_LOADER_FOREX')
const hideLoader = createAction('HIDE_LOADER_FOREX')

export default {
  setForexList,
  setForexCount,
  showLoader,
  hideLoader,
}
