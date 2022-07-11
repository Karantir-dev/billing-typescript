const getVhostList = state => state.vhost.vhostList
const getVhostCount = state => state.vhost.vhostCount

const getVhostFiltersList = state => state.vhost.vhostFiltersList
const getVhostFilters = state => state.vhost.vhostFilters

export default {
  getVhostList,
  getVhostCount,
  getVhostFiltersList,
  getVhostFilters,
}