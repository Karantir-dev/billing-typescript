const getTheme = state => state.theme
const getIsPinned = state => state.pinned
const getIsLoadding = state => state.isLoading
const isScrollForbidden = state => state.scrollForbidden
const onlineStatus = state => state.online

export default {
  getTheme,
  getIsLoadding,
  getIsPinned,
  isScrollForbidden,
  onlineStatus,
}
