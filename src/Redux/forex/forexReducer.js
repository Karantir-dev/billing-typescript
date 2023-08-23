import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import forexActions from './forexActions'

const initialState = {
  forexList: null,
  forexCount: 0,
}

const forexList = createReducer(initialState.forexList, {
  [forexActions.setForexList]: (_, { payload }) => payload,
})
const forexCount = createReducer(initialState.forexCount, {
  [forexActions.setForexCount]: (_, { payload }) => payload,
})

const forexReducer = combineReducers({ forexList, forexCount })

export default forexReducer
