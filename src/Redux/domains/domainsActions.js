import { createAction } from '@reduxjs/toolkit'

const setDomainsList = createAction('SET_DOMAINS_LIST')
const setDomainsCount = createAction('SET_DOMAINS_COUNT')

export default {
  setDomainsList,
  setDomainsCount,
}
