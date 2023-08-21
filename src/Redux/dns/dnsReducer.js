import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dnsActions from './dnsActions'

const initialState = {
  dnsList: null,
  dnsCount: 0,
  isLoadingDns: false,
}

const dnsList = createReducer(initialState.dnsList, {
  [dnsActions.setDNSList]: (_, { payload }) => payload,
})
const dnsCount = createReducer(initialState.dnsCount, {
  [dnsActions.setDNSCount]: (_, { payload }) => payload,
})

const isLoadingDns = createReducer(initialState.isLoadingDns, {
  [dnsActions.showLoader]: () => true,
  [dnsActions.hideLoader]: () => false,
})

const dnsReducer = combineReducers({ dnsList, dnsCount, isLoadingDns })

export default dnsReducer
