import { createReducer } from '@reduxjs/toolkit'

import { actions } from './actions'
import { authActions } from './auth/authActions'

const initialState = {
  theme: 'light',
  isLoading: false,
  userInfo: [],
}

export const theme = createReducer(initialState.theme, {
  [actions.changeTheme]: state => (state === 'light' ? 'dark' : 'light'),
})

export const isLoading = createReducer(initialState.isLoading, {
  [actions.showLoader]: () => true,
  [actions.hideLoader]: () => false,
  [authActions.registrationSuccess]: () => false,
  [authActions.loginRequest]: () => true,
  [authActions.loginSuccess]: () => false,
  [authActions.loginError]: () => false,
  [authActions.logoutSuccess]: () => false,
})

// export const userInfo = createReducer(initialState.userInfo, {
//   [actions.getUserInfo]: state => {},
// })
