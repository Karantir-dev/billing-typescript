import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import ftpActions from './ftpActions'

const initialState = {
  ftpList: null,
  ftpCount: 0,
}

const ftpList = createReducer(initialState.ftpList, {
  [ftpActions.setFTPList]: (_, { payload }) => payload,
})
const ftpCount = createReducer(initialState.ftpCount, {
  [ftpActions.setFtpCount]: (_, { payload }) => payload,
})

const ftpReducer = combineReducers({ ftpList, ftpCount })

export default ftpReducer
