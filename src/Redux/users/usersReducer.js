import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import usersActions from './usersActions'

const initialState = {
  users: [],
}

const users = createReducer(initialState.users, {
  [usersActions.setUsers]: (_, { payload }) => payload,
})

const usersReducer = combineReducers({
  users,
})

export default usersReducer
