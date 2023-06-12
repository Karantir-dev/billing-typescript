import { usersReducer, usersActions } from '@redux'

test('GET USERS', () => {
  const initialState = []
  const action = usersActions.setUsers([{ user: 'name' }])
  const newState = usersReducer(initialState, action)
  expect(newState).toEqual({
    users: [{ user: 'name' }],
    rights: [],
  })
})
