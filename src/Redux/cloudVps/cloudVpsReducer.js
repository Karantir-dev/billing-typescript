import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cloudVpsActions from './cloudVpsActions'
import { TARIFFS_PRICES } from '@src/utils/constants'

const initialState = {
  itemForModalsReducer: {},
  instances: null,
  instancesCount: 0,
  instancesFilters: {},
  instancesTariffs: {},
  instancesDcList: null,
  windowsTag: '',
  cloudPremiumTag: '',
  operationSystems: null,
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

const instancesTariffs = createReducer(initialState.instancesTariffs, {
  [cloudVpsActions.setInstancesTariffs]: (state, { payload }) => {
    /** 13 it is hardcoded dc id - it must be refactored */
    const key = Object.keys(payload)[0]
    console.log('DC key', key)

    payload[key] = payload[key]?.map(el => {
      const newDayPrice = TARIFFS_PRICES[el.title.main.$]?.day
      const newMonthPrice = TARIFFS_PRICES[el.title.main.$]?.month
      el.prices.price.cost.$ = String(newDayPrice)
      el.prices.price.cost.month = String(newMonthPrice)

      return el
    })

    return { ...state, ...payload }
  },
})

const instancesDcList = createReducer(initialState.instancesDcList, {
  [cloudVpsActions.setInstancesDCList]: (_, { payload }) => payload,
})

const windowsTag = createReducer(initialState.windowsTag, {
  [cloudVpsActions.setWindowsTag]: (_, { payload }) => payload,
})

const cloudPremiumTag = createReducer(initialState.cloudPremiumTag, {
  [cloudVpsActions.setCloudPremiumTag]: (_, { payload }) => payload,
})

const operationSystems = createReducer(initialState.operationSystems, {
  [cloudVpsActions.setOperationSystems]: (state, { payload }) => {
    return { ...state, ...payload }
  },
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
  itemForModalsReducer,
  instances,
  instancesCount,
  instancesFilters,
  instancesTariffs,
  instancesDcList,
  windowsTag,
  cloudPremiumTag,
  operationSystems,
  sshList,
  sshCount,
  allSshList,
})

export default cloudVpsReducer
