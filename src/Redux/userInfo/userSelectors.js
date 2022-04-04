const getUserInfo = state => state.currentUserInfo.userInfo
const getUserTickets = state => state.currentUserInfo.userTickets
const getUserItems = state => state.currentUserInfo.userItems

export const userSelectors = {
  getUserInfo,
  getUserTickets,
  getUserItems,
}
