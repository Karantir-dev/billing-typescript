const getSessionId = state => state.auth.sessionId
const getTotpFormVisibility = state => state.auth.totpFormVisibility

export default {
  getSessionId,
  getTotpFormVisibility,
}
