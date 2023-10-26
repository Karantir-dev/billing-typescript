import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import payersActions from './payersActions'
import { PROFILE_TYPES } from '@utils/constants'

const initialState = {
  payersList: null,
  payersCount: 0,

  payersSelectLists: null,
  payersSelectedFields: null,

  payersData: {},
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
  [payersActions.setPayersSelectLists]: (_, { payload }) => {
    const profiletype = payload?.profiletype.map(el => ({
      ...el,
      $: PROFILE_TYPES[el.$key],
    }))
    return { ...payload, profiletype }
  },
  [payersActions.updatePayersSelectLists]: (state, { payload }) =>
    (state = { ...current(state), ...payload }),
})

const payersSelectedFields = createReducer(initialState.payersSelectedFields, {
  [payersActions.setPayersSelectedFields]: (_, { payload }) => payload,
})

const payersData = createReducer(initialState.payersData, {
  [payersActions.setPayersData]: (state, { payload }) => ({
    ...current(state),
    ...payload,
  }),
})

const payersReducer = combineReducers({
  payersList,
  payersCount,
  payersSelectLists,
  payersSelectedFields,
  payersData,
})

export default payersReducer
