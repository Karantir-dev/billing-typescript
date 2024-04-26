const getUserInfo = state => state.currentUserInfo.userInfo
const getUserTickets = state => state.currentUserInfo.userTickets
const getUserItems = state => state.currentUserInfo.userItems

const getCurrentSessionRights = state => state.currentUserInfo.currentSessionRights

const getUserInfoLoading = state => state.currentUserInfo.userInfoLoading
const getIsNewMessage = state => state.currentUserInfo.isNewMessage
const getActiveServices = state => state.currentUserInfo.userActiveServices

export default {
  getUserInfo,
  getUserTickets,
  getUserItems,
  getCurrentSessionRights,
  getUserInfoLoading,
  getIsNewMessage,
  getActiveServices,
}
