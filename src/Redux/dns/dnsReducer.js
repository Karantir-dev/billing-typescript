import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dnsActions from './dnsActions'

const initialState = {
  dnsList: [],
}

const dnsList = createReducer(initialState.dnsList, {
  [dnsActions.setDNSList]: (_, { payload }) => payload,
})

const dedicReducer = combineReducers({ dnsList })

export default dedicReducer
