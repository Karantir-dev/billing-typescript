const getTheme = state => state.theme
const getIsPinned = state => state.pinned
const getIsLoading = state => state.isLoading
const isScrollForbidden = state => state.scrollForbidden
const onlineStatus = state => state.online

export default {
  getTheme,
  getIsLoading,
  getIsPinned,
  isScrollForbidden,
  onlineStatus,
}
