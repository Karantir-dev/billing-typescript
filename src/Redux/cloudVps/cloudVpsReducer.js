import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import cloudVpsActions from './cloudVpsActions'

const initialState = {
  itemForModalsReducer: {},
}

const itemForModalsReducer = createReducer(initialState.itemForModalsReducer, {
  [cloudVpsActions.setItemForModals]: (_, { payload }) => payload,
})

const cloudVpsReducer = combineReducers({
  itemForModalsReducer,
})

export default cloudVpsReducer
