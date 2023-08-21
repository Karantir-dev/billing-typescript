import { createAction } from '@reduxjs/toolkit'

const setDNSList = createAction('SET_DNS_LIST')
const setDNSCount = createAction('SET_DNS_COUNT')

const showLoader = createAction('SHOW_LOADER_DNS')
const hideLoader = createAction('HIDE_LOADER_DNS')

export default {
  setDNSList,
  setDNSCount,
  showLoader,
  hideLoader,
}
