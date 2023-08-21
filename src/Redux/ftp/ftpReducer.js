import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import ftpActions from './ftpActions'

const initialState = {
  ftpList: null,
  ftpCount: 0,
  isLoadingFtp: false,
}

const ftpList = createReducer(initialState.ftpList, {
  [ftpActions.setFTPList]: (_, { payload }) => payload,
})
const ftpCount = createReducer(initialState.ftpCount, {
  [ftpActions.setFtpCount]: (_, { payload }) => payload,
})

const isLoadingFtp = createReducer(initialState.isLoadingFtp, {
  [ftpActions.showLoader]: () => true,
  [ftpActions.hideLoader]: () => false,
})

const ftpReducer = combineReducers({ ftpList, ftpCount, isLoadingFtp })

export default ftpReducer
