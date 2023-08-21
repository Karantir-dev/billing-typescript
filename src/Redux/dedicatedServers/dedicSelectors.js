const getTafifList = state => state.dedic.tarifList
const getServersList = state => state.dedic.serversList
const getDedicCount = state => state.dedic.dedicCount
const getIsLoadingDedics = state => state.dedic.isLoadingDedics

export default {
  getTafifList,
  getServersList,
  getDedicCount,
  getIsLoadingDedics,
}
