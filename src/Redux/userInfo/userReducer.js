import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import userActions from './userActions'

const initialState = {
  userInfo: {},
  userTickets: [],
  userItems: [],
  currentSessionRights: [],
  userInfoLoading: false,
  isNewMessage: false,
}

const userInfo = createReducer(initialState.userInfo, {
  [userActions.setUserInfo]: (_, { payload }) => payload,
  [userActions.updateUserInfo]: (state, { payload }) => {
    return { ...state, ...payload }
  },
  [userActions.setEmailStatus]: (state, { payload }) => {
    state.$email_verified = payload
    return state
  },
})
const userTickets = createReducer(initialState.userTickets, {
  [userActions.setTickets]: (_, { payload }) => payload,
})
const userItems = createReducer(initialState.userItems, {
  [userActions.setItems]: (_, { payload }) => payload,
  [userActions.removeItems]: (state, { payload }) =>
    (state = {
      ...current(state),
      messages: current(state?.messages)?.filter(el => el?.$id !== payload?.id),
      messages_count: +payload?.messages - 1,
    }),
})

const userInfoLoading = createReducer(initialState.userInfoLoading, {
  [userActions.showUserInfoLoading]: () => true,
  [userActions.hideUserInfoLoading]: () => false,
})

const currentSessionRights = createReducer(initialState.currentSessionRights, {
  [userActions.setCurrentSessionRihgts]: (_, { payload }) => payload,
})

const isNewMessage = createReducer(initialState.isNewMessage, {
  [userActions.setIsNewMessage]: (_, { payload }) => payload,
})

const userReducer = combineReducers({
  userInfo,
  userTickets,
  userItems,
  userInfoLoading,
  currentSessionRights,
  isNewMessage,
})

export default userReducer
