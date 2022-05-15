import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import payersActions from './payersActions'

const initialState = {
  payersList: [],
  payersCount: 0,
}

const payersList = createReducer(initialState.payersList, {
  [payersActions.setPayersList]: (_, { payload }) => payload,
  [payersActions.deletePayer]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.id?.$ !== payload)),
})

const payersCount = createReducer(initialState.payersCount, {
  [payersActions.setPayersCount]: (_, { payload }) => payload,
})

const payersReducer = combineReducers({
  payersList,
  payersCount,
})

export default payersReducer
