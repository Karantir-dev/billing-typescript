import { createAction } from '@reduxjs/toolkit'

const changeTheme = createAction('CHANGE_THEME')
const changeIsPinned = createAction('CHANGE_PINNED')

const showLoader = createAction('SHOW_LOADER')
const hideLoader = createAction('HIDE_LOADER')

const disableScrolling = createAction('DISABLE_SCROLLING')
const enableScrolling = createAction('ENABLE_SCROLLING')

const setOnline = createAction('SET_ONLINE')
const setOffline = createAction('SET_OFFLINE')

const showBlockingModal = createAction('SHOW_BLOCKING_MODAL')
const hideBlockingModal = createAction('HIDE_BLOCKING_MODAL')

export default {
  changeTheme,
  showLoader,
  hideLoader,
  changeIsPinned,
  disableScrolling,
  enableScrolling,
  setOnline,
  setOffline,
  showBlockingModal,
  hideBlockingModal,
}
