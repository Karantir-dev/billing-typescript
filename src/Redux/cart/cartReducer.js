import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cartActions from './cartActions'

const initialState = {
  cartState: { isOpened: false, redirectPath: '' },
}

const cartState = createReducer(initialState.cartState, {
  [cartActions.setCartIsOpenedState]: (_, { payload }) => payload,
})

const cartReducer = combineReducers({
  cartState,
})

export default cartReducer
