import { createReducer } from '@reduxjs/toolkit'
import actions from './actions'
import { combineReducers } from 'redux'

const initialState = {
  promocode: '',
  refLink: '',
  isLoadingAffiliateAbout: false,
  isLoadingAffiliateIncome: false,
  isLoadingAffiliateStatistic: false,
}

const promocode = createReducer(initialState.promocode, {
  [actions.setReferralLink]: (_, { payload }) => payload.promocode,
})
const refLink = createReducer(initialState.refLink, {
  [actions.setReferralLink]: (_, { payload }) => payload.refLink,
})

const isLoadingAffiliateAbout = createReducer(initialState.isLoadingAffiliateAbout, {
  [actions.showLoaderAbout]: () => true,
  [actions.hideLoaderAbout]: () => false,
})

const isLoadingAffiliateIncome = createReducer(initialState.isLoadingAffiliateIncome, {
  [actions.showLoaderIncome]: () => true,
  [actions.hideLoaderIncome]: () => false,
})
const isLoadingAffiliateStatistic = createReducer(initialState.isLoadingAffiliateStatistic, {
  [actions.showLoaderStatistic]: () => true,
  [actions.hideLoaderStatistic]: () => false,
})

const affiliateReducer = combineReducers({
  promocode,
  refLink,
  isLoadingAffiliateAbout,
  isLoadingAffiliateIncome,
  isLoadingAffiliateStatistic
})

export default affiliateReducer
