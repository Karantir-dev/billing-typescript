import { createAction } from '@reduxjs/toolkit'

const changeTheme = createAction('CHANGE_THEME')
const changeIsPinned = createAction('CHANGE_PINNED')

const showLoader = createAction('SHOW_LOADER')
const hideLoader = createAction('HIDE_LOADER')

const disableScrolling = createAction('DISABLE_SCROLLING')
const enableScrolling = createAction('ENABLE_SCROLLING')

export default {
  changeTheme,
  showLoader,
  hideLoader,
  changeIsPinned,
  disableScrolling,
  enableScrolling,
}
