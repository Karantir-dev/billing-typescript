import { createReducer } from '@reduxjs/toolkit'
import { affiliateActions } from './actions'

const initialState = {
  promocode: '',
  refLink: '',
}

export const affiliateProgram = createReducer(initialState, {
  [affiliateActions.setReferralLink]: (_, { payload }) => payload,
})
