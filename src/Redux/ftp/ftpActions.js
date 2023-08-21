import { createAction } from '@reduxjs/toolkit'

const setFTPList = createAction('SET_FTP_LIST')
const setFtpCount = createAction('SET_FTP_COUNT')

const showLoader = createAction('SHOW_LOADER_FTP')
const hideLoader = createAction('HIDE_LOADER_FTP')

export default {
  setFTPList,
  setFtpCount,
  showLoader,
  hideLoader,
}
