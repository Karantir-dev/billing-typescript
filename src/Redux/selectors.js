const getTheme = state => state.theme
const getIsPinned = state => state.pinned
const getIsLoadding = state => state.isLoading

export const selectors = {
  getTheme,
  getIsLoadding,
  getIsPinned,
}
