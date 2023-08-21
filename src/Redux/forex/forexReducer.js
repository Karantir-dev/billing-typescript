import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import forexActions from './forexActions'

const initialState = {
  forexList: null,
  forexCount: 0,
  isLoadingForex: false,
}

const forexList = createReducer(initialState.forexList, {
  [forexActions.setForexList]: (_, { payload }) => payload,
})
const forexCount = createReducer(initialState.forexCount, {
  [forexActions.setForexCount]: (_, { payload }) => payload,
})

const isLoadingForex = createReducer(initialState.isLoadingForex, {
  [forexActions.showLoader]: () => true,
  [forexActions.hideLoader]: () => false,
})

const forexReducer = combineReducers({ forexList, forexCount, isLoadingForex })

export default forexReducer
