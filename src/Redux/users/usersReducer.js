import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import usersActions from './usersActions'

const initialState = {
  users: [],
  rights: [],
  currentSessionRights: [],
}

const users = createReducer(initialState.users, {
  [usersActions.setUsers]: (_, { payload }) => payload,
})

const rights = createReducer(initialState.rights, {
  [usersActions.setRights]: (_, { payload }) => payload,
})
const currentSessionRights = createReducer(initialState.currentSessionRights, {
  [usersActions.setCurrentSessionRihgts]: (_, { payload }) => payload,
})

const usersReducer = combineReducers({
  users,
  rights,
  currentSessionRights,
})

export default usersReducer
