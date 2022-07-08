import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dnsActions from './forexActions'

const initialState = {
  forexList: null,
}

const forexList = createReducer(initialState.forexList, {
  [dnsActions.setForexList]: (_, { payload }) => payload,
})

const forexReducer = combineReducers({ forexList })

export default forexReducer
