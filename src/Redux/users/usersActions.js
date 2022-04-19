import { createAction } from '@reduxjs/toolkit'

const setUsers = createAction('SET_USERS')

export const usersActions = {
  setUsers,
}
