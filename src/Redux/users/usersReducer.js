import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import usersActions from './usersActions'

const initialState = {
  users: [],
  rights: [],
  isLoadingTrusted: false
}

const users = createReducer(initialState.users, {
  [usersActions.setUsers]: (_, { payload }) => payload,
})

const rights = createReducer(initialState.rights, {
  [usersActions.setRights]: (_, { payload }) => payload,
})

const isLoadingTrusted = createReducer(initialState.isLoadingTrusted, {
  [usersActions.showLoaderTrusted]: () => true,
  [usersActions.hideLoaderTrusted]: () => false,
})

const usersReducer = combineReducers({
  users,
  rights,
  isLoadingTrusted
})

export default usersReducer
