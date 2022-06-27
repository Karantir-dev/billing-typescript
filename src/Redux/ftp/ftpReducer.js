import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import ftpActions from './ftpActions'

const initialState = {
  ftpList: null,
}

const ftpList = createReducer(initialState.ftpList, {
  [ftpActions.setFTPList]: (_, { payload }) => payload,
})

const ftpReducer = combineReducers({ ftpList })

export default ftpReducer
