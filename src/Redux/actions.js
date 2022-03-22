import { createAction } from '@reduxjs/toolkit'

const changeTheme = createAction('CHANGE_THEME')

const showLoader = createAction('SHOW_LOADER')
const hideLoader = createAction('HIDE_LOADER')

export const actions = {
  changeTheme,
  showLoader,
  hideLoader,
}
