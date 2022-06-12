import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import domainsActions from './domainsActions'

const initialState = {
  domainsList: [],
  domainsCount: 0,
}

const domainsList = createReducer(initialState.domainsList, {
  [domainsActions.setDomainsList]: (_, { payload }) => payload,
  [domainsActions.deleteDomain]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const domainsCount = createReducer(initialState.domainsCount, {
  [domainsActions.setDomainsCount]: (_, { payload }) => payload,
})

const domainsReducer = combineReducers({ domainsList, domainsCount })

export default domainsReducer
