const getIsLoadding = state => state.auth.isLoading
const getSessionId = state => state.auth.sessionId
const getTotpFormVisibility = state => state.auth.totpFormVisibility

export const authSelectors = {
  getIsLoadding,
  getSessionId,
  getTotpFormVisibility,
}
