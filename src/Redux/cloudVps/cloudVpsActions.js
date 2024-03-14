import { createAction } from '@reduxjs/toolkit'

const setItemForModals = createAction('SET_ITEM_FOR_MODALS')
const setInstancesList = createAction('SET_INSTANCES_LIST')
const setInstancesCount = createAction('SET_INSTANCES_COUNT')
const setInstancesFilters = createAction('SET_INSTANCES_FILTERS')
const setInstancesTariffs = createAction('SET_INSTANCES_TARIFFS')

export default {
  setItemForModals,
  setInstancesList,
  setInstancesCount,
  setInstancesFilters,
  setInstancesTariffs,
}
