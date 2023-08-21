import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import domainsActions from './domainsActions'

const initialState = {
  domainsList: null,
  domainsCount: 0,

  domainsFiltersList: null,
  domainsFilters: null,
  isLoadingDomains: false,
}

const domainsList = createReducer(initialState.domainsList, {
  [domainsActions.setDomainsList]: (_, { payload }) => payload,
  [domainsActions.deleteDomain]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const domainsCount = createReducer(initialState.domainsCount, {
  [domainsActions.setDomainsCount]: (_, { payload }) => payload,
})

const domainsFiltersList = createReducer(initialState.domainsFiltersList, {
  [domainsActions.setDomainsFiltersLists]: (_, { payload }) => payload,
})

const domainsFilters = createReducer(initialState.domainsFilters, {
  [domainsActions.setDomainsFilters]: (_, { payload }) => payload,
})

const isLoadingDomains = createReducer(initialState.isLoadingDomains, {
  [domainsActions.showLoader]: () => true,
  [domainsActions.hideLoader]: () => false,
})

const domainsReducer = combineReducers({
  domainsList,
  domainsCount,
  domainsFiltersList,
  domainsFilters,
  isLoadingDomains,
})

export default domainsReducer
