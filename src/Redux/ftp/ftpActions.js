import { createAction } from '@reduxjs/toolkit'

const setFTPList = createAction('SET_FTP_LIST')
const setFtpCount = createAction('SET_FTP_COUNT')

export default {
  setFTPList,
  setFtpCount,
}
