const getPayersList = state => state.payers.payersList
const getPayersCount = state => state.payers.payersCount
const getPayersSelectLists = state => state.payers.payersSelectLists
const getPayersSelectedFields = state => state.payers.payersSelectedFields

export default {
  getPayersList,
  getPayersCount,
  getPayersSelectLists,
  getPayersSelectedFields,
}
