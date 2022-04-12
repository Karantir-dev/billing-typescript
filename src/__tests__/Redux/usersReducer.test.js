import { usersReducer } from '../../Redux/users/usersReducer'
import { usersActions } from '../../Redux/users/usersActions'

test('CHANGE TEMPORARY ID REQUEST', () => {
  const initialState = []
  const action = usersActions.setUsers({ user: 'name' })
  const newState = usersReducer(initialState, action)
  expect(newState).toEqual({
    users: [{ user: 'name' }],
  })
})
