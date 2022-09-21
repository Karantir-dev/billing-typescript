import { authActions, authReducer } from '../../Redux'

describe('dataloader reducers', () => {
  test('CHANGE SESSION ID REQUEST', () => {
    const initialState = {}
    const action = authActions.loginSuccess('testSessionId')
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: 'testSessionId',
      temporaryId: null,
      isLogined: false,
      totpFormVisibility: 'hidden',
      geoData: null,
    })
  })

  test('DELETE SESSION ID REQUEST', () => {
    const initialState = {}
    const action = authActions.logoutSuccess()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      isLogined: false,
      totpFormVisibility: 'hidden',
      geoData: null,
    })
  })

  test('CHANGE TEMPORARY ID REQUEST', () => {
    const initialState = {}
    const action = authActions.setTemporaryId('testTemporaryId')
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      isLogined: false,
      temporaryId: 'testTemporaryId',
      totpFormVisibility: 'hidden',
      geoData: null,
    })
  })

  test('DELETE TEMPORARY ID REQUEST', () => {
    const initialState = {}
    const action = authActions.clearTemporaryId()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      isLogined: false,
      totpFormVisibility: 'hidden',
      geoData: null,
    })
  })

  test('OPEN TOTP REQUEST', () => {
    const initialState = {}
    const action = authActions.openTotpForm()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      isLogined: false,
      totpFormVisibility: 'shown',
      geoData: null,
    })
  })

  test('CLOSE TOTP REQUEST', () => {
    const initialState = {}
    const action = authActions.closeTotpForm()
    const newState = authReducer(initialState, action)
    expect(newState).toEqual({
      sessionId: null,
      temporaryId: null,
      isLogined: false,
      totpFormVisibility: 'hidden',
      geoData: null,
    })
  })
})
