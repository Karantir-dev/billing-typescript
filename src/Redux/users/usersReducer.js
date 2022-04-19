import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { usersActions } from './usersActions'

const initialState = {
  users: [],
  rights: [],
}

const users = createReducer(initialState.users, {
  [usersActions.setUsers]: (_, { payload }) => payload,
})

const rights = createReducer(initialState.rights, {
  [usersActions.setRights]: (_, { payload }) => payload,
})

export const usersReducer = combineReducers({
  users,
  rights,
})
