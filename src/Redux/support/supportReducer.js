import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import supportActions from './supportActions'

const initialState = {
  ticketList: [],
}

const ticketList = createReducer(initialState.ticketList, {
  [supportActions.getTickets]: (_, { payload }) => payload,
  [supportActions.clearTickets]: () => [],
})

export const supportReducer = combineReducers({
  ticketList,
})
