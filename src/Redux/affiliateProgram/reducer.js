import { createReducer } from '@reduxjs/toolkit'
import actions from './actions'
import { combineReducers } from 'redux'

const initialState = {
  promocode: '',
  refLink: '',
}

const promocode = createReducer(initialState.promocode, {
  [actions.setReferralLink]: (_, { payload }) => payload.promocode,
})
const refLink = createReducer(initialState.refLink, {
  [actions.setReferralLink]: (_, { payload }) => payload.refLink,
})

const affiliateReducer = combineReducers({
  promocode,
  refLink,
})

export default affiliateReducer
