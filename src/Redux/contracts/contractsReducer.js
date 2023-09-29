import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import contarctsActions from './contarctsActions'

const initialState = {
  contractsList: [],
  contractsCount: 0,
}

const contractsList = createReducer(initialState.contractsList, {
  [contarctsActions.setContractsList]: (_, { payload }) => payload,
})
const contractsCount = createReducer(initialState.contractsCount, {
  [contarctsActions.setContractsCount]: (_, { payload }) => payload,
})

const contractsReducer = combineReducers({
  contractsList,
  contractsCount,
})

export default contractsReducer
