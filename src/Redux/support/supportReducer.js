import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import supportActions from './supportActions'

const initialState = {
  ticketList: [],
  ticketArchiveList: [],
  ticketCount: 0,
  ticketArchiveCount: 0,
  ticket: null,
  departmentsList: [],
  serviceList: [],

  abuseFilterList: [],
  tstatusFilterList: [],
  timeFilterList: [],

  currentFilters: null,
  isLoadingSupportRequest: false,
  isLoadingSupportRequestArchive: false
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

const departmentsList = createReducer(initialState.departmentsList, {
  [supportActions.getDepartments]: (state, { payload }) => payload,
})

const serviceList = createReducer(initialState.serviceList, {
  [supportActions.getServices]: (state, { payload }) => payload,
})

const abuseFilterList = createReducer(initialState.abuseFilterList, {
  [supportActions.getAbuseFilterList]: (state, { payload }) => payload,
})

const tstatusFilterList = createReducer(initialState.tstatusFilterList, {
  [supportActions.getTstatusFilterList]: (state, { payload }) => payload,
})

const timeFilterList = createReducer(initialState.timeFilterList, {
  [supportActions.getTimeFilterList]: (state, { payload }) => payload,
})

const currentFilters = createReducer(initialState.currentFilters, {
  [supportActions.getCurrentFilters]: (state, { payload }) => payload,
})

const isLoadingSupportRequest = createReducer(initialState.isLoadingSupportRequest, {
  [supportActions.showLoaderRequest]: () => true,
  [supportActions.hideLoaderRequest]: () => false,
})

const isLoadingSupportRequestArchive = createReducer(initialState.isLoadingSupportRequestArchive, {
  [supportActions.showLoaderRequestArchive]: () => true,
  [supportActions.hideLoaderRequestArchive]: () => false,
})

const supportReducer = combineReducers({
  ticketList,
  ticketCount,
  ticketArchiveCount,
  ticketArchiveList,
  ticket,
  departmentsList,
  serviceList,
  abuseFilterList,
  tstatusFilterList,
  timeFilterList,
  currentFilters,
  isLoadingSupportRequest,
  isLoadingSupportRequestArchive,
})

export default supportReducer
