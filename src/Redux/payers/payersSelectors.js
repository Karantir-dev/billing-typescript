const getPayersList = state => state.payers.payersList
const getPayersCount = state => state.payers.payersCount
const getPayersSelectLists = state => state.payers.payersSelectLists
const getPayersSelectedFields = state => state.payers.payersSelectedFields
const getPayersData = state => state.payers.payersData

export default {
  getPayersList,
  getPayersCount,
  getPayersSelectLists,
  getPayersSelectedFields,
  getPayersData,
}
