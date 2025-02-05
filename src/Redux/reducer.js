import { createReducer } from '@reduxjs/toolkit'

import { actions, authActions } from '@redux'
import { cookies } from '@utils'

const initialState = {
  theme: 'light',
  isLoading: false,
  pinned: false,
  scrollForbidden: false,
  online: true,
  blockingModalShown: false,
  promotionsList: [],
}

export const theme = createReducer(initialState.theme, {
  [actions.changeTheme]: (state, {payload}) => {
    const theme = payload ? payload : state === 'light' ? 'dark' : 'light'
    cookies.setCookie('theme', theme)
    
    return theme
  }
    
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

export const online = createReducer(initialState.online, {
  [actions.setOffline]: () => false,
  [actions.setOnline]: () => true,
})

export const blockingModalShown = createReducer(initialState.blockingModalShown, {
  [actions.hideBlockingModal]: () => false,
  [actions.showBlockingModal]: () => true,
})

export const promotionsList = createReducer(initialState.promotionsList, {
  [actions.setPromotionsList]: (_, { payload }) => payload,
})
