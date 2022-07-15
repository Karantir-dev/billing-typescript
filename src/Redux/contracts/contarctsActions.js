import { createAction } from '@reduxjs/toolkit'

const setContractsList = createAction('SET_CONTRACTS_LIST')
const setContractsCount = createAction('SET_CONTRACTS_COUNT')

export default {
  setContractsList,
  setContractsCount,
}
