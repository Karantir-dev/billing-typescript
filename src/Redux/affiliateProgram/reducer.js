import { createReducer } from '@reduxjs/toolkit'
import actions from './actions'

const initialState = {
  promocode: '',
  refLink: '',
}

const affiliateProgram = createReducer(initialState, {
  [actions.setReferralLink]: (_, { payload }) => payload,
})

export default affiliateProgram
