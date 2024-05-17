import { createAction } from '@reduxjs/toolkit'

const setItemForModals = createAction('SET_ITEM_FOR_MODALS')
const setInstancesList = createAction('SET_INSTANCES_LIST')
const setInstancesCount = createAction('SET_INSTANCES_COUNT')
const setInstancesFilters = createAction('SET_INSTANCES_FILTERS')

const setPremiumTariffs = createAction('SET_PREMIUM_TARIFFS')
const setBasicTariffs = createAction('SET_BASIC_TARIFFS')
const setInstancesDCList = createAction('SET_INSTANCES_DC_LIST')
const setWindowsTag = createAction('SET_WINDOWS_TAG')
const setCloudPremiumTag = createAction('SET_CLOUD_PREMIUM_TAG')
const setOperationSystems = createAction('SET_OS_LIST')
const setSshList = createAction('SET_SSH_LIST')
const setSshCount = createAction('SET_SSH_COUNT')
const setAllSshList = createAction('SET_ALL_SSH_COUNT')

export default {
  setItemForModals,
  setInstancesList,
  setInstancesCount,
  setInstancesFilters,
  setPremiumTariffs,
  setBasicTariffs,
  setInstancesDCList,
  setWindowsTag,
  setCloudPremiumTag,
  setOperationSystems,
  setSshList,
  setSshCount,
  setAllSshList,
}
