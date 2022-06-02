import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cartActions from './cartActions'

const initialState = {
  isOpened: true,
}

const isOpened = createReducer(initialState.isOpened, {
  [cartActions.setCartIsOpenedState]: (_, { payload }) => payload,
})

const cartReducer = combineReducers({
  isOpened,
})

export default cartReducer
