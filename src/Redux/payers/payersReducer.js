import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import payersActions from './payersActions'

const initialState = {
  payersList: null,
  payersCount: 0,

  payersSelectLists: null,
  payersSelectedFields: null,
  isLoadingPayers: false,
}

const payersList = createReducer(initialState.payersList, {
  [payersActions.setPayersList]: (_, { payload }) => payload,
  [payersActions.deletePayer]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const payersCount = createReducer(initialState.payersCount, {
  [payersActions.setPayersCount]: (_, { payload }) => payload,
})

const payersSelectLists = createReducer(initialState.payersSelectLists, {
  [payersActions.setPayersSelectLists]: (_, { payload }) => payload,
  [payersActions.updatePayersSelectLists]: (state, { payload }) =>
    (state = { ...current(state), ...payload }),
})

const payersSelectedFields = createReducer(initialState.payersSelectedFields, {
  [payersActions.setPayersSelectedFields]: (_, { payload }) => payload,
})

const isLoadingPayers = createReducer(initialState.isLoadingPayers, {
  [payersActions.showLoader]: () => true,
  [payersActions.hideLoader]: () => false,
})

const payersReducer = combineReducers({
  payersList,
  payersCount,
  payersSelectLists,
  payersSelectedFields,
  isLoadingPayers,
})

export default payersReducer
