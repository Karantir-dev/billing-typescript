import { createAction } from '@reduxjs/toolkit'

const setVhostList = createAction('SET_VHOST_LIST')
const deleteVhost = createAction('DELETE_VHOST')

const setVhostFiltersLists = createAction('SET_VHOST_FILTERS_LISTS')
const setVhostFilters = createAction('SET_VHOST_FILTERS')

const setVhostCount = createAction('SET_VHOST_COUNT')

const showLoader = createAction('SHOW_LOADER_VHOST')
const hideLoader = createAction('HIDE_LOADER_VHOST')

export default {
  setVhostList,
  deleteVhost,
  setVhostFiltersLists,
  setVhostFilters,
  setVhostCount,
  showLoader,
  hideLoader,
}
