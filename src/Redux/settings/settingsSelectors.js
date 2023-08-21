const getUserEdit = state => state.settings.userEditInfo
const getUserParams = state => state.settings.userParamsInfo
const getTwoStepVerif = state => state.settings.twoStepVerif
const getIsLoadingPersonal = state => state.settings.isLoadingPersonal

export default {
  getUserEdit,
  getUserParams,
  getTwoStepVerif,
  getIsLoadingPersonal
}
