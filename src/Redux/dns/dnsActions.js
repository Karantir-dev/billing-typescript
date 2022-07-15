import { createAction } from '@reduxjs/toolkit'

const setDNSList = createAction('SET_DNS_LIST')
const setDNSCount = createAction('SET_DNS_COUNT')

export default {
  setDNSList,
  setDNSCount,
}
