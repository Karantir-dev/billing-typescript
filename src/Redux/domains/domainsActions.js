import { createAction } from '@reduxjs/toolkit'

const setDomainsList = createAction('SET_DOMAINS_LIST')
const deleteDomain = createAction('DELETE_DOMAIN')

const setDomainsCount = createAction('SET_DOMAINS_COUNT')

export default {
  setDomainsList,
  setDomainsCount,
  deleteDomain,
}
