import { createAction } from '@reduxjs/toolkit'

const setVpnList = createAction('SET_VPN_LIST')
const deleteVpn = createAction('DELETE_VPN')

const setVpnFiltersLists = createAction('SET_VPN_FILTERS_LISTS')
const setVpnFilters = createAction('SET_VPN_FILTERS')

const setVpnCount = createAction('SET_VPN_COUNT')

export default {
  setVpnList,
  deleteVpn,
  setVpnFiltersLists,
  setVpnFilters,
  setVpnCount,
}
