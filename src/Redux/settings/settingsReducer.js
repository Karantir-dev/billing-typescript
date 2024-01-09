import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import settingsActions from './settingsActions'

const initialState = {
  userEditInfo: null,
  userParamsInfo: null,
  twoStepVerif: null,
  socNetIntegration: null,
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

const twoStepVerif = createReducer(initialState.twoStepVerif, {
  [settingsActions.setTwoStepVerif]: (_, { payload }) => payload,
  [settingsActions.updateTwoStepVerif]: (state, { payload }) =>
    (state = { ...current(state), qrimage: payload }),
  [settingsActions.clearTwoStepVerif]: () => null,
})

const socNetIntegration = createReducer(initialState.socNetIntegration, {
  [settingsActions.setSocNetIntegration]: (_, { payload }) => payload,
  [settingsActions.clearSocNetIntegration]: () => null,
})

const settingsReducer = combineReducers({
  userEditInfo,
  userParamsInfo,
  twoStepVerif,
  socNetIntegration,
})

export default settingsReducer
