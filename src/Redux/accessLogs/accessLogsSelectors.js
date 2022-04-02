const getLogsList = state => state.access_logs.accessLogsList
const getLogsFilters = state => state.access_logs.accessLogsFilters
const getCurrentLogsFilters = state => state.access_logs.accessLogsCurrentFilters

export default {
  getLogsList,
  getLogsFilters,
  getCurrentLogsFilters,
}
