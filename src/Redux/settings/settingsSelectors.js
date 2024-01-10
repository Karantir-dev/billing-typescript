const getUserEdit = state => state.settings.userEditInfo
const getUserParams = state => state.settings.userParamsInfo
const getTwoStepVerif = state => state.settings.twoStepVerif
const getSocNetIntegration = state => state.settings.socNetIntegration

export default {
  getUserEdit,
  getUserParams,
  getTwoStepVerif,
  getSocNetIntegration,
}
