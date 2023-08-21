import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import accessLogsActions from './accessLogsActions'

const initialState = {
  accessLogsList: [],
  accessLogsCount: 0,
  accessLogsFilters: [],
  accessLogsCurrentFilters: null,
  isLoadingLogs: false

}

const accessLogsList = createReducer(initialState.accessLogsList, {
  [accessLogsActions.getAccessLogs]: (_, { payload }) => payload,
  [accessLogsActions.clearAccessLogs]: () => [],
})

const accessLogsCount = createReducer(initialState.accessLogsCount, {
  [accessLogsActions.getAccessLogsCount]: (_, { payload }) => payload,
  [accessLogsActions.clearAccessLogsCount]: () => 0,
})

const accessLogsFilters = createReducer(initialState.accessLogsFilters, {
  [accessLogsActions.getAccessLogsFilters]: (_, { payload }) => payload,
  [accessLogsActions.clearAccessLogsFilters]: () => [],
})

const accessLogsCurrentFilters = createReducer(initialState.accessLogsCurrentFilters, {
  [accessLogsActions.getCurrentFilters]: (_, { payload }) => payload,
  [accessLogsActions.clearCurrentFilters]: () => null,
})

const isLoadingLogs = createReducer(initialState.isLoadingLogs, {
  [accessLogsActions.showLoaderLogs]: () => true,
  [accessLogsActions.hideLoaderLogs]: () => false,
})

const accessLogsReducer = combineReducers({
  accessLogsList,
  accessLogsFilters,
  accessLogsCurrentFilters,
  accessLogsCount,
  isLoadingLogs
})

export default accessLogsReducer
