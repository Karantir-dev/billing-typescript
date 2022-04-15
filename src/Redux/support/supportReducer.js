import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import supportActions from './supportActions'

const initialState = {
  ticketList: [],
  ticketCount: 0,
}

const ticketList = createReducer(initialState.ticketList, {
  [supportActions.getTickets]: (_, { payload }) => payload,
  [supportActions.clearTickets]: () => [],
})

const ticketCount = createReducer(initialState.ticketCount, {
  [supportActions.getTicketCount]: (_, { payload }) => payload,
  [supportActions.clearTicketCount]: () => 0,
})

export const supportReducer = combineReducers({
  ticketList,
  ticketCount,
})
