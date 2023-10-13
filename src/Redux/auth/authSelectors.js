const getSessionId = state => state.auth.sessionId
const getIsLogined = state => state.auth.isLogined
const getGeoData = state => state.auth.geoData
const getTotpFormVisibility = state => state.auth.totpFormVisibility
const getAuthErrorMsg = state => state.auth.authErrorMsg

export default {
  getSessionId,
  getTotpFormVisibility,
  getIsLogined,
  getGeoData,
  getAuthErrorMsg,
}
