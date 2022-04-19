import { createAction } from '@reduxjs/toolkit'

const setUsers = createAction('SET_USERS')
const setRights = createAction('SET_RIGHTS')

export const usersActions = {
  setUsers,
  setRights,
}
