import { createAction } from '@reduxjs/toolkit'

const getAccessLogs = createAction('GET_ACCESS_LOGS')
const getAccessLogsCount = createAction('GET_ACCESS_LOG_COUNT')

const clearAccessLogs = createAction('CLEAR_ACCESS_LOGS')
const clearAccessLogsCount = createAction('CLEAR_ACCESS_LOG_COUNT')

const getAccessLogsFilters = createAction('GET_ACCESS_FILTERS')
const clearAccessLogsFilters = createAction('CLEAR_ACCESS_FILTERS')

const getCurrentFilters = createAction('GET_CURENT_FILTERS')
const clearCurrentFilters = createAction('CLEAR_CURENT_FILTERS')

export default {
  getAccessLogs,
  clearAccessLogs,
  getAccessLogsFilters,
  clearAccessLogsFilters,
  getCurrentFilters,
  clearCurrentFilters,
  getAccessLogsCount,
  clearAccessLogsCount,
}
