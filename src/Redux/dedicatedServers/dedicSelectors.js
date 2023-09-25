const getTafifList = state => state.dedic.tarifList
const getServersList = state => state.dedic.serversList
const getDedicCount = state => state.dedic.dedicCount
const getVDSCount = state => state.dedic.vdsCount
const getVDSList = state => state.dedic.VDSList
const getVDSServersList = state => state.dedic.VDSServersList

export default {
  getTafifList,
  getServersList,
  getDedicCount,
  getVDSList,
  getVDSServersList,
  getVDSCount,
}
