import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import supportActions from './supportActions'

const initialState = {
  ticketList: [],
  ticketArchiveList: [],
  ticketCount: 0,
  ticketArchiveCount: 0,
  ticket: null,
}

const ticketList = createReducer(initialState.ticketList, {
  [supportActions.getTickets]: (state, { payload }) => payload,
  [supportActions.updateTickets]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
  [supportActions.clearTickets]: () => [],
})

const ticketArchiveList = createReducer(initialState.ticketArchiveList, {
  [supportActions.getTicketsArchive]: (state, { payload }) => payload,
})

const ticketArchiveCount = createReducer(initialState.ticketArchiveCount, {
  [supportActions.getTicketArchiveCount]: (state, { payload }) => payload,
})

const ticketCount = createReducer(initialState.ticketCount, {
  [supportActions.getTicketCount]: (state, { payload }) => payload,
  [supportActions.clearTicketCount]: () => 0,
})

const ticket = createReducer(initialState.ticket, {
  [supportActions.getTicket]: (state, { payload }) => payload,
  [supportActions.clearTicket]: () => null,
})

const supportReducer = combineReducers({
  ticketList,
  ticketCount,
  ticketArchiveCount,
  ticketArchiveList,
  ticket,
})

export default supportReducer
