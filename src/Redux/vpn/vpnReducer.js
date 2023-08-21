import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import vpnActions from './vpnActions'

const initialState = {
  vpnList: null,
  vpnCount: 0,

  vpnFiltersList: null,
  vpnFilters: null,
  isLoadingVpn: false,
}

const vpnList = createReducer(initialState.vpnList, {
  [vpnActions.setVpnList]: (_, { payload }) => payload,
  [vpnActions.deleteVpn]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const vpnCount = createReducer(initialState.vpnCount, {
  [vpnActions.setVpnCount]: (_, { payload }) => payload,
})

const vpnFiltersList = createReducer(initialState.vpnFiltersList, {
  [vpnActions.setVpnFiltersLists]: (_, { payload }) => payload,
})

const vpnFilters = createReducer(initialState.vpnFilters, {
  [vpnActions.setVpnFilters]: (_, { payload }) => payload,
})

const isLoadingVpn = createReducer(initialState.isLoadingVpn, {
  [vpnActions.showLoader]: () => true,
  [vpnActions.hideLoader]: () => false,
})

const vpnReducer = combineReducers({
  vpnList,
  vpnCount,
  vpnFiltersList,
  vpnFilters,
  isLoadingVpn,
})

export default vpnReducer
