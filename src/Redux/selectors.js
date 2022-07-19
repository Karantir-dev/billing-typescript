const getTheme = state => state.theme
const getIsPinned = state => state.pinned
const getIsLoadding = state => state.isLoading
const isScrollForbidden = state => state.scrollForbidden

export default {
  getTheme,
  getIsLoadding,
  getIsPinned,
  isScrollForbidden,
}
