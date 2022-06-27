import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dedicActions from './dedicActions'

const initialState = {
  tarifList: [],
  filterList: [],
  serversList: null,
}

const tarifList = createReducer(initialState.tarifList, {
  [dedicActions.setTarifList]: (_, { payload }) => payload,
})
const filterList = createReducer(initialState.filterList, {
  [dedicActions.setFilterList]: (_, { payload }) => payload,
})
const serversList = createReducer(initialState.serversList, {
  [dedicActions.setServersList]: (_, { payload }) => payload,
})

const dedicReducer = combineReducers({ tarifList, filterList, serversList })

export default dedicReducer
