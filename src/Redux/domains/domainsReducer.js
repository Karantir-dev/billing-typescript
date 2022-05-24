import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import domainsActions from './domainsActions'

const initialState = {
  domainsList: [],
  domainsCount: 0,
}

const domainsList = createReducer(initialState.domainsList, {
  [domainsActions.setDomainsList]: (_, { payload }) => payload,
})

const domainsCount = createReducer(initialState.domainsCount, {
  [domainsActions.setDomainsCount]: (_, { payload }) => payload,
})

const domainsReducer = combineReducers({ domainsList, domainsCount })

export default domainsReducer
