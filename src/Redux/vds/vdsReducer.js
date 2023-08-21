import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import vdsActions from './vdsActions'

const initialState = {
  isLoadingVDS: false,
}

const isLoadingVDS = createReducer(initialState.isLoadingVDS, {
  [vdsActions.showLoaderVDS]: () => true,
  [vdsActions.hideLoaderVDS]: () => false,
})

const vdsReducer = combineReducers({
  isLoadingVDS,
})

export default vdsReducer
