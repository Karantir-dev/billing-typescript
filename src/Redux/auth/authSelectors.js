const getIsLoadding = state => state.auth.isLoading
const getToken = state => state.auth.token

export const authSelectors = {
  getIsLoadding,
  getToken,
}
