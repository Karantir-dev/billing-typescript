import { createReducer } from '@reduxjs/toolkit'

import { actions, authActions } from './'

const initialState = {
  theme: 'light',
  isLoading: false,
  userInfo: [],
  pinned: false,
  scrollForbidden: false,
}

export const theme = createReducer(initialState.theme, {
  [actions.changeTheme]: state => (state === 'light' ? 'dark' : 'light'),
})

export const pinned = createReducer(initialState.pinned, {
  [actions.changeIsPinned]: state => !state,
})

export const isLoading = createReducer(initialState.isLoading, {
  [actions.showLoader]: () => true,
  [actions.hideLoader]: () => false,
  [authActions.registrationSuccess]: () => false,
  [authActions.loginSuccess]: () => false,
  [authActions.logoutSuccess]: () => false,
})

export const scrollForbidden = createReducer(initialState.scrollForbidden, {
  [actions.disableScrolling]: () => true,
  [actions.enableScrolling]: () => false,
})

// export const userInfo = createReducer(initialState.userInfo, {
//   [actions.getUserInfo]: state => {},
// })
