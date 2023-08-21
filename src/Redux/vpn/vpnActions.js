import { createAction } from '@reduxjs/toolkit'

const setVpnList = createAction('SET_VPN_LIST')
const deleteVpn = createAction('DELETE_VPN')

const setVpnFiltersLists = createAction('SET_VPN_FILTERS_LISTS')
const setVpnFilters = createAction('SET_VPN_FILTERS')

const setVpnCount = createAction('SET_VPN_COUNT')

const showLoader = createAction('SHOW_LOADER_VPN')
const hideLoader = createAction('HIDE_LOADER_VPN')

export default {
  setVpnList,
  deleteVpn,
  setVpnFiltersLists,
  setVpnFilters,
  setVpnCount,
  showLoader,
  hideLoader,
}
