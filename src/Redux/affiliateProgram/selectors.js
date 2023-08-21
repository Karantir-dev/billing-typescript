const getRefLink = state => state.affiliateProgram.refLink
const getPromocode = state => state.affiliateProgram.promocode
const getIsLoadingAffiliateAbout = state => state.affiliateProgram.isLoadingAffiliateAbout
const getIsLoadingAffiliateIncome = state =>
  state.affiliateProgram.isLoadingAffiliateIncome
  
const getIsLoadingAffiliateStatistic = state =>
  state.affiliateProgram.isLoadingAffiliateStatistic

export default {
  getRefLink,
  getPromocode,
  getIsLoadingAffiliateAbout,
  getIsLoadingAffiliateIncome,
  getIsLoadingAffiliateStatistic,
}
