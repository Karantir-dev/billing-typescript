import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import contarctsActions from './contarctsActions'

const initialState = {
  contractsList: [],
  contractsCount: 0,
  isLoadingContracts: false,

}

const contractsList = createReducer(initialState.contractsList, {
  [contarctsActions.setContractsList]: (_, { payload }) => payload,
})
const contractsCount = createReducer(initialState.contractsCount, {
  [contarctsActions.setContractsCount]: (_, { payload }) => payload,
})

const isLoadingContracts = createReducer(initialState.isLoadingContracts, {
  [contarctsActions.showLoader]: () => true,
  [contarctsActions.hideLoader]: () => false,
})

const contractsReducer = combineReducers({ contractsList, contractsCount, isLoadingContracts })

export default contractsReducer
