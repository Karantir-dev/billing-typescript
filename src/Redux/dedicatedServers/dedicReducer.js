import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dedicActions from './dedicActions'

const initialState = {
  tarifList: [],
  filterList: [],
  serversList: null,
  dedicCount: 0,
  isLoadingDedics: false,

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

const dedicCount = createReducer(initialState.dedicCount, {
  [dedicActions.setDedicCount]: (_, { payload }) => payload,
})

const isLoadingDedics = createReducer(initialState.isLoadingDedics, {
  [dedicActions.showLoader]: () => true,
  [dedicActions.hideLoader]: () => false,
})

const dedicReducer = combineReducers({ tarifList, filterList, serversList, dedicCount, isLoadingDedics })

export default dedicReducer
