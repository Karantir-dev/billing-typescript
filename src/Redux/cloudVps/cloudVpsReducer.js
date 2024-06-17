import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cloudVpsActions from './cloudVpsActions'
import { rewriteCloudsPrices } from '@src/utils'

const initialState = {
  premiumTariffs: null,
  basicTariffs: null,
  operationSystems: null,

  itemForModalsReducer: {},
  instances: null,
  instancesCount: 0,
  instancesFilters: {},
  instancesDcList: null,
  windowsTag: '',
  sshList: null,
  sshCount: 0,
  allSshList: [],
}

const itemForModalsReducer = createReducer(initialState.itemForModalsReducer, {
  [cloudVpsActions.setItemForModals]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
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

const premiumTariffs = createReducer(initialState.premiumTariffs, {
  [cloudVpsActions.setPremiumTariffs]: (state, { payload }) => {
    return { ...state, ...rewriteCloudsPrices(payload) }
  },
})
const basicTariffs = createReducer(initialState.basicTariffs, {
  [cloudVpsActions.setBasicTariffs]: (state, { payload }) => {
    return { ...state, ...rewriteCloudsPrices(payload) }
  },
})

const instancesDcList = createReducer(initialState.instancesDcList, {
  [cloudVpsActions.setInstancesDCList]: (_, { payload }) => payload,
})

const windowsTag = createReducer(initialState.windowsTag, {
  [cloudVpsActions.setWindowsTag]: (_, { payload }) => payload,
})

const operationSystems = createReducer(initialState.operationSystems, {
  [cloudVpsActions.setOperationSystems]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
})

const sshList = createReducer(initialState.sshList, {
  [cloudVpsActions.setSshList]: (_, { payload }) => payload,
})

const allSshList = createReducer(initialState.allSshList, {
  [cloudVpsActions.setAllSshList]: (_, { payload }) => payload,
})

const sshCount = createReducer(initialState.sshCount, {
  [cloudVpsActions.setSshCount]: (_, { payload }) => payload,
})

const cloudVpsReducer = combineReducers({
  premiumTariffs,
  basicTariffs,
  operationSystems,
  itemForModalsReducer,
  instances,
  instancesCount,
  instancesFilters,
  instancesDcList,
  windowsTag,
  sshList,
  sshCount,
  allSshList,
})

export default cloudVpsReducer
