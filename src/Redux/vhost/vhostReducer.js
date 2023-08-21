import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import vhostActions from './vhostActions'

const initialState = {
  vhostList: null,
  vhostCount: 0,

  vhostFiltersList: null,
  vhostFilters: null,
  isLoadingVhost: false,
}

const vhostList = createReducer(initialState.vhostList, {
  [vhostActions.setVhostList]: (_, { payload }) => payload,
  [vhostActions.deleteVhost]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const vhostCount = createReducer(initialState.vhostCount, {
  [vhostActions.setVhostCount]: (_, { payload }) => payload,
})

const vhostFiltersList = createReducer(initialState.vhostFiltersList, {
  [vhostActions.setVhostFiltersLists]: (_, { payload }) => payload,
})

const vhostFilters = createReducer(initialState.vhostFilters, {
  [vhostActions.setVhostFilters]: (_, { payload }) => payload,
})

const isLoadingVhost = createReducer(initialState.isLoadingVhost, {
  [vhostActions.showLoader]: () => true,
  [vhostActions.hideLoader]: () => false,
})

const vhostReducer = combineReducers({
  vhostList,
  vhostCount,
  vhostFiltersList,
  vhostFilters,
  isLoadingVhost,
})

export default vhostReducer
