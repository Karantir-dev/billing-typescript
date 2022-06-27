import { createReducer, current } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import userActions from './userActions'

const initialState = {
  userInfo: {},
  userTickets: [],
  userItems: [],
  currentSessionRights: [],
  userInfoLoading: false,
}

const userInfo = createReducer(initialState.userInfo, {
  [userActions.setUserInfo]: (_, { payload }) => payload,
})
const userTickets = createReducer(initialState.userTickets, {
  [userActions.setTickets]: (_, { payload }) => payload,
})
const userItems = createReducer(initialState.userItems, {
  [userActions.setItems]: (_, { payload }) => payload,
  [userActions.removeItems]: (state, { payload }) =>
    (state = current(state)?.filter(el => el?.$id !== payload)),
})

const userInfoLoading = createReducer(initialState.userInfoLoading, {
  [userActions.showUserInfoLoading]: () => true,
  [userActions.hideUserInfoLoading]: () => false,
})

const currentSessionRights = createReducer(initialState.currentSessionRights, {
  [userActions.setCurrentSessionRihgts]: (_, { payload }) => payload,
})

const userReducer = combineReducers({
  userInfo,
  userTickets,
  userItems,
  userInfoLoading,
  currentSessionRights,
})

export default userReducer
