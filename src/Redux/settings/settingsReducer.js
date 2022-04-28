import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import settingsActions from './settingsActions'

const initialState = {
  userEditInfo: null,
  userParamsInfo: null,
}

const userEditInfo = createReducer(initialState.userEditInfo, {
  [settingsActions.setUsersEdit]: (_, { payload }) => payload,
})

const userParamsInfo = createReducer(initialState.userParamsInfo, {
  [settingsActions.setUsersParams]: (_, { payload }) => payload,
})

const usersReducer = combineReducers({
  userEditInfo,
  userParamsInfo,
})

export default usersReducer
