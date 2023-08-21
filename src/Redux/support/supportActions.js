import { createAction } from '@reduxjs/toolkit'

const getTickets = createAction('GET_TICKETS')
const updateTickets = createAction('UPDATE_TICKETS')
const clearTickets = createAction('CLEAR_TICKETS')

const getTicketsArchive = createAction('GET_TICKETS_ARCHIVE')
const getTicketArchiveCount = createAction('GET_TICKETS_ARCHIVE_COUNT')

const getTicket = createAction('GET_TICKET')
const clearTicket = createAction('CLEAR_TICKET')

const getDepartments = createAction('GET_DEPARTMENTS')
const getServices = createAction('GET_SERVICES')

const getTicketCount = createAction('GET_TICKETS_COUNT')
const clearTicketCount = createAction('CLEAR_TICKETS_COUNT')

const getAbuseFilterList = createAction('GET_ABUSE_FILTER_LIST')
const getTstatusFilterList = createAction('GET_TSTATUS_FILTER_LIST')
const getTimeFilterList = createAction('GET_TIME_FILTER_LIST')

const getCurrentFilters = createAction('GET_CURRENT_FILTERS')

const showLoaderRequest = createAction('SHOW_LOADER_REQUEST')
const hideLoaderRequest = createAction('HIDE_LOADER_REQUEST')

const showLoaderRequestArchive = createAction('SHOW_LOADER_REQUEST_ARCHIVE')
const hideLoaderRequestArchive = createAction('HIDE_LOADER_REQUEST_ARCHIVE')

export default {
  getTickets,
  clearTickets,
  updateTickets,
  getTicketCount,
  clearTicketCount,
  getTicketsArchive,
  getTicketArchiveCount,
  getTicket,
  clearTicket,
  getDepartments,
  getServices,
  getAbuseFilterList,
  getTstatusFilterList,
  getTimeFilterList,
  getCurrentFilters,
  showLoaderRequest,
  hideLoaderRequest,
  showLoaderRequestArchive,
  hideLoaderRequestArchive,
}
