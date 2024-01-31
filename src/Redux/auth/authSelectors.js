const getSessionId = state => state.auth.sessionId
const getPreviousRoute = state => state.auth.previousRoute
const getIsLogined = state => state.auth.isLogined
const getGeoData = state => state.auth.geoData
const getTotpFormVisibility = state => state.auth.totpFormVisibility
const getAuthErrorMsg = state => state.auth.authErrorMsg

export default {
  getSessionId,
  getPreviousRoute,
  getTotpFormVisibility,
  getIsLogined,
  getGeoData,
  getAuthErrorMsg,
}
