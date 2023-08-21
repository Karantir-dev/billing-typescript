import { createAction } from '@reduxjs/toolkit'

const setUsers = createAction('SET_USERS')
const setRights = createAction('SET_RIGHTS')
const hideLoaderTrusted = createAction('SHOW_LOADER_TRUSTED')
const showLoaderTrusted = createAction('HIDE_LOADER_TRUSTED')
export default {
  setUsers,
  setRights,
  hideLoaderTrusted,
  showLoaderTrusted,
}
