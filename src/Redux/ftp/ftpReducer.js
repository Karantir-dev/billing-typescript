import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import dedicActions from './ftpActions'

const initialState = {
  ftpList: [],
}

const ftpList = createReducer(initialState.ftpList, {
  [dedicActions.setFTPList]: (_, { payload }) => payload,
})

const dedicReducer = combineReducers({ ftpList })

export default dedicReducer
