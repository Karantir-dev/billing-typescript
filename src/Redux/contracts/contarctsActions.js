import { createAction } from '@reduxjs/toolkit'

const setContractsList = createAction('SET_CONTRACTS_LIST')
const setContractsCount = createAction('SET_CONTRACTS_COUNT')

const hideLoader = createAction('SHOW_LOADER_CONTRACTS')
const showLoader = createAction('HIDE_LOADER_CONTRACTS')

export default {
  setContractsList,
  setContractsCount,
  hideLoader,
  showLoader,
}
