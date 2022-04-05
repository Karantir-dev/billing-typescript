const getLogsList = state => state.access_logs.accessLogsList
const getLogsCount = state => state.access_logs.accessLogsCount
const getLogsFilters = state => state.access_logs.accessLogsFilters
const getCurrentLogsFilters = state => state.access_logs.accessLogsCurrentFilters

export default {
  getLogsList,
  getLogsFilters,
  getCurrentLogsFilters,
  getLogsCount,
}
