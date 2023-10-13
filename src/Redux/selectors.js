const getTheme = state => state.theme
const getIsPinned = state => state.pinned
const getIsLoading = state => state.isLoading
const isScrollForbidden = state => state.scrollForbidden
const onlineStatus = state => state.online
const getBlockingModalStatus = state => state.blockingModalShown

export default {
  getTheme,
  getIsLoading,
  getIsPinned,
  isScrollForbidden,
  onlineStatus,
  getBlockingModalStatus,
}
