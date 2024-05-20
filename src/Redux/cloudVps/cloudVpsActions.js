import { createAction } from '@reduxjs/toolkit'

const setPremiumTariffs = createAction('SET_PREMIUM_TARIFFS')
const setBasicTariffs = createAction('SET_BASIC_TARIFFS')
const setPremiumOperationSystems = createAction('SET_PREMIUM_OS_LIST')
const setBasicOperationSystems = createAction('SET_BASIC_OS_LIST')

const setItemForModals = createAction('SET_ITEM_FOR_MODALS')
const setInstancesList = createAction('SET_INSTANCES_LIST')
const setInstancesCount = createAction('SET_INSTANCES_COUNT')
const setInstancesFilters = createAction('SET_INSTANCES_FILTERS')
const setInstancesDCList = createAction('SET_INSTANCES_DC_LIST')
const setWindowsTag = createAction('SET_WINDOWS_TAG')
const setCloudBasicTag = createAction('SET_CLOUD_BASIC_TAG')
const setSshList = createAction('SET_SSH_LIST')
const setSshCount = createAction('SET_SSH_COUNT')
const setAllSshList = createAction('SET_ALL_SSH_COUNT')

export default {
  setPremiumTariffs,
  setBasicTariffs,
  setPremiumOperationSystems,
  setBasicOperationSystems,
  setItemForModals,
  setInstancesList,
  setInstancesCount,
  setInstancesFilters,
  setInstancesDCList,
  setWindowsTag,
  setCloudBasicTag,
  setSshList,
  setSshCount,
  setAllSshList,
}
