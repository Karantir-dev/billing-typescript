import { theme, pinned, isLoading } from '@redux/reducer'
import { authActions, actions } from '@redux'

describe('dataloader reducers', () => {
  test('CHANGE THEME REQUEST', () => {
    const initialState = { theme: 'light' }
    const action = actions.changeTheme()
    const newState = theme(initialState.theme, action)
    expect(newState).toEqual('dark')
  })

  test('CHANGE THEME DARK TO LIGHT REQUEST', () => {
    const initialState = { theme: 'dark' }
    const action = actions.changeTheme()
    const newState = theme(initialState.theme, action)
    expect(newState).toEqual('light')
  })

  test('CHANGE PINED REQUEST', () => {
    const initialState = {}
    const action = actions.changeIsPinned()
    const newState = pinned(initialState.pinned, action)
    expect(newState).toEqual(true)
  })

  test('SHOW LOADER REQUEST', () => {
    const initialState = {}
    const action = actions.showLoader()
    const newState = isLoading(initialState.isLoading, action)
    expect(newState).toEqual(true)
  })

  test('HIDE LOADER REQUEST', () => {
    const initialState = {}
    const action = actions.hideLoader()
    const newState = isLoading(initialState.isLoading, action)
    expect(newState).toEqual(false)
  })

  test('HIDE LOADER REGISTER REQUEST', () => {
    const initialState = {}
    const action = authActions.registrationSuccess()
    const newState = isLoading(initialState.isLoading, action)
    expect(newState).toEqual(false)
  })

  test('HIDE LOADER LOGIN REQUEST', () => {
    const initialState = {}
    const action = authActions.loginSuccess()
    const newState = isLoading(initialState.isLoading, action)
    expect(newState).toEqual(false)
  })

  test('HIDE LOADER LOGIUT REQUEST', () => {
    const initialState = {}
    const action = authActions.logoutSuccess()
    const newState = isLoading(initialState.isLoading, action)
    expect(newState).toEqual(false)
  })
})
