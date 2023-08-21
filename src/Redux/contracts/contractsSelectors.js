const getContractsList = state => state.contracts.contractsList
const getContractsCount = state => state.contracts.contractsCount
const getIsLoadingContracts = state => state.contracts.isLoadingContracts

export default {
  getContractsList,
  getContractsCount,
  getIsLoadingContracts,
}
