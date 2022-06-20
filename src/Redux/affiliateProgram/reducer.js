import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import actions from './actions'

const initialState = {
  promocode: '',
  refLink: '',
}

const affiliateProgram = createReducer(initialState, {
  [actions.setReferralLink]: (_, { payload }) => payload,
})

const affiliateProgramReducer = combineReducers({ affiliateProgram })

export default affiliateProgramReducer
