import { createAction } from '@reduxjs/toolkit'

const setReferralLink = createAction('SET_REFFERAL_LINK_&_PROMOCODE')
const showLoaderAbout = createAction('SHOW_LOADER_AFFILIATE_ABOUT')
const hideLoaderAbout = createAction('HIDE_LOADER_AFFILIATE_ABOUT')
const showLoaderIncome = createAction('SHOW_LOADER_AFFILIATE_INCOME')
const hideLoaderIncome = createAction('HIDE_LOADER_AFFILIATE_INCOME')
const showLoaderStatistic = createAction('SHOW_LOADER_AFFILIATE_STATISTIC')
const hideLoaderStatistic = createAction('HIDE_LOADER_AFFILIATE_STATISTIC')

export default {
  setReferralLink,
  showLoaderAbout,
  hideLoaderAbout,
  showLoaderIncome,
  hideLoaderIncome,
  showLoaderStatistic,
  hideLoaderStatistic,
}
