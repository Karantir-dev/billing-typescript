import { createAction } from '@reduxjs/toolkit'

const setItemForModals = createAction('SET_ITEM_FOR_MODALS')
const setInstancesList = createAction('SET_INSTANCES_LIST')
const setInstancesCount = createAction('SET_INSTANCES_COUNT')
const setInstancesFilters = createAction('SET_INSTANCES_FILTERS')
const setInstancesTariffs = createAction('SET_INSTANCES_TARIFFS')
const setInstancesDCList = createAction('SET_INSTANCES_DC_LIST')
const setWindowsTag = createAction('SET_WINDOWS_TAG')
const setOperationSystems = createAction('SET_OS_LIST')
const setSshList = createAction('SET_SSH_LIST')
const setSshCount = createAction('SET_SSH_COUNT')

export default {
  setItemForModals,
  setInstancesList,
  setInstancesCount,
  setInstancesFilters,
  setInstancesTariffs,
  setInstancesDCList,
  setWindowsTag,
  setOperationSystems,
  setSshList,
  setSshCount,
}
