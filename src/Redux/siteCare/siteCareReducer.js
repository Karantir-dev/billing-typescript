import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import siteCareActions from './siteCareActions'

const initialState = {
  siteCareList: null,
  siteCareCount: 0,

  siteCareFiltersList: null,
  siteCareFilters: null,
}

const siteCareList = createReducer(initialState.siteCareList, {
  [siteCareActions.setSiteCareList]: (_, { payload }) => payload,
  [siteCareActions.deleteSiteCare]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const siteCareCount = createReducer(initialState.siteCareCount, {
  [siteCareActions.setSiteCareCount]: (_, { payload }) => payload,
})

const siteCareFiltersList = createReducer(initialState.siteCareFiltersList, {
  [siteCareActions.setSiteCareFiltersLists]: (_, { payload }) => payload,
})

const siteCareFilters = createReducer(initialState.siteCareFilters, {
  [siteCareActions.setSiteCareFilters]: (_, { payload }) => payload,
})

const siteCareReducer = combineReducers({
  siteCareList,
  siteCareCount,
  siteCareFiltersList,
  siteCareFilters,
})

export default siteCareReducer
