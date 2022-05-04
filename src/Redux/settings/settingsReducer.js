import { createReducer, current } from '@reduxjs/toolkit'
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
  [settingsActions.setUpdateTime]: (state, { payload }) =>
    (state = { ...current(state), time: payload }),
  [settingsActions.setUpdateAvatar]: (state, { payload }) =>
    (state = { ...current(state), avatar_view: payload }),
  [settingsActions.emailStatusUpadate]: (state, { payload }) =>
    (state = { ...current(state), email_confirmed_status: payload }),
})

const usersReducer = combineReducers({
  userEditInfo,
  userParamsInfo,
})

export default usersReducer
