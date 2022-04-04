const getTheme = state => state.theme
const getIsLoadding = state => state.isLoading
const getUserInfo = state => state.currentUserInfo.userInfo
const getUserTickets = state => state.currentUserInfo.userTickets
const getUserItems = state => state.currentUserInfo.userItems

export const selectors = {
  getTheme,
  getIsLoadding,
  getUserInfo,
  getUserTickets,
  getUserItems,
}
