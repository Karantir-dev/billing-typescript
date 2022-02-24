import { createReducer } from '@reduxjs/toolkit'
import actions from './actions'

const initialState = {
  theme: 'light',
}

const theme = createReducer(initialState.theme, {
  [actions.changeTheme]: (state, _) => (state === 'light' ? 'dark' : 'light'),
})

export default theme
