import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import accessLogsActions from './accessLogsActions'

const initialState = {
  accessLogsList: [],
  accessLogsFilters: [],
  accessLogsCurrentFilters: null,
}

const accessLogsList = createReducer(initialState.accessLogsList, {
  [accessLogsActions.getAccessLogs]: (_, { payload }) => payload,
  [accessLogsActions.clearAccessLogs]: () => [],
})

const accessLogsFilters = createReducer(initialState.accessLogsFilters, {
  [accessLogsActions.getAccessLogsFilters]: (_, { payload }) => payload,
  [accessLogsActions.clearAccessLogsFilters]: () => [],
})

const accessLogsCurrentFilters = createReducer(initialState.accessLogsCurrentFilters, {
  [accessLogsActions.getCurrentFilters]: (_, { payload }) => payload,
  [accessLogsActions.clearCurrentFilters]: () => [],
})

export const accessLogsReducer = combineReducers({
  accessLogsList,
  accessLogsFilters,
  accessLogsCurrentFilters,
})
