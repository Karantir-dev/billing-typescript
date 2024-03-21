import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cloudVpsActions from './cloudVpsActions'

const initialState = {
  itemForModalsReducer: {},
  instances: null,
  instancesCount: 0,
  instancesFilters: {},
  instancesTariffs: null,
  instancesDcList: null,
  windowsTag: '',
  operationSystems: null,
  sshList: null,
}

const itemForModalsReducer = createReducer(initialState.itemForModalsReducer, {
  [cloudVpsActions.setItemForModals]: (_, { payload }) => payload,
})

const instances = createReducer(initialState.instances, {
  [cloudVpsActions.setInstancesList]: (_, { payload }) => payload,
})
const instancesCount = createReducer(initialState.instancesCount, {
  [cloudVpsActions.setInstancesCount]: (_, { payload }) => payload,
})

const instancesFilters = createReducer(initialState.instancesFilters, {
  [cloudVpsActions.setInstancesFilters]: (_, { payload }) => payload,
})
const instancesTariffs = createReducer(initialState.instancesTariffs, {
  [cloudVpsActions.setInstancesTariffs]: (_, { payload }) => payload,
})

const instancesDcList = createReducer(initialState.instancesDcList, {
  [cloudVpsActions.setInstancesDCList]: (_, { payload }) => payload,
})

const windowsTag = createReducer(initialState.windowsTag, {
  [cloudVpsActions.setWindowsTag]: (_, { payload }) => payload,
})

const operationSystems = createReducer(initialState.operationSystems, {
  [cloudVpsActions.setOperationSystems]: (state, { payload }) => {
    return { ...state, ...payload }
  },
})

const sshList = createReducer(initialState.sshList, {
  [cloudVpsActions.setSshList]: (_, { payload }) => payload,
})

const cloudVpsReducer = combineReducers({
  itemForModalsReducer,
  instances,
  instancesCount,
  instancesFilters,
  instancesTariffs,
  instancesDcList,
  windowsTag,
  operationSystems,
  sshList,
})

export default cloudVpsReducer
