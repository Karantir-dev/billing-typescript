import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cloudVpsActions from './cloudVpsActions'

const initialState = {
  itemForModalsReducer: {},
  instances: null,
  instancesCount: 0,
  instancesFilters: {},
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

const cloudVpsReducer = combineReducers({
  itemForModalsReducer,
  instances,
  instancesCount,
  instancesFilters,
})

export default cloudVpsReducer
