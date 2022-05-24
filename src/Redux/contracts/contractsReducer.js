import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import contarctsActions from './contarctsActions'

const initialState = {
  contractsList: [],
}

const contractsList = createReducer(initialState.contractsList, {
  [contarctsActions.setContractsList]: (_, { payload }) => payload,
})

const contractsReducer = combineReducers({ contractsList })

export default contractsReducer
