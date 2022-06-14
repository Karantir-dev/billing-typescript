import { createAction } from '@reduxjs/toolkit'

const setDomainsList = createAction('SET_DOMAINS_LIST')
const deleteDomain = createAction('DELETE_DOMAIN')

const setDomainsFiltersLists = createAction('SET_DOMAINS_FILTERS_LISTS')
const setDomainsFilters = createAction('SET_DOMAINS_FILTERS')

const setDomainsCount = createAction('SET_DOMAINS_COUNT')

export default {
  setDomainsList,
  setDomainsCount,
  deleteDomain,
  setDomainsFiltersLists,
  setDomainsFilters,
}
