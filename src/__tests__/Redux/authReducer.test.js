import { authActions, authReducer } from '../../Redux'

describe('dataloader reducers', () => {
  test('CHANGE SESSION ID REQUEST', () => {
    const initialState = {}
    const action = authActions.loginSuccess('testSessionId')
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: 'testSessionId',
      temporaryId: null,
      totpFormVisibility: 'hidden',
    })
  })

  test('DELETE SESSION ID REQUEST', () => {
    const initialState = {}
    const action = authActions.logoutSuccess()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      totpFormVisibility: 'hidden',
    })
  })

  test('CHANGE TEMPORARY ID REQUEST', () => {
    const initialState = {}
    const action = authActions.setTemporaryId('testTemporaryId')
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: 'testTemporaryId',
      totpFormVisibility: 'hidden',
    })
  })

  test('DELETE TEMPORARY ID REQUEST', () => {
    const initialState = {}
    const action = authActions.clearTemporaryId()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      totpFormVisibility: 'hidden',
    })
  })

  test('OPEN TOTP REQUEST', () => {
    const initialState = {}
    const action = authActions.openTotpForm()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      totpFormVisibility: 'shown',
    })
  })

  test('CLOSE TOTP REQUEST', () => {
    const initialState = {}
    const action = authActions.closeTotpForm()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      totpFormVisibility: 'hidden',
    })
  })
})
