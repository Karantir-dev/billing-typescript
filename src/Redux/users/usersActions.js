import { createAction } from '@reduxjs/toolkit'

const setUsers = createAction('SET_USERS')
const setRights = createAction('SET_RIGHTS')
const setCurrentSessionRihgts = createAction('SET_CURRENT_SESSION_RIGHTS')

export default {
  setUsers,
  setRights,
  setCurrentSessionRihgts,
}
