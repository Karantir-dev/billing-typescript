const getPayersList = state => state.payers.payersList
const getPayersCount = state => state.payers.payersCount
const getPayersSelectLists = state => state.payers.payersSelectLists
const getPayersSelectedFields = state => state.payers.payersSelectedFields
const getIsLoadingPayers = state => state.payers.isLoadingPayers

export default {
  getPayersList,
  getPayersCount,
  getPayersSelectLists,
  getPayersSelectedFields,
  getIsLoadingPayers
}
