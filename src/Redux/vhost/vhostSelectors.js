const getVhostList = state => state.vhost.vhostList
const getVhostCount = state => state.vhost.vhostCount

const getVhostFiltersList = state => state.vhost.vhostFiltersList
const getVhostFilters = state => state.vhost.vhostFilters
const isWordpressAllowed = state => state.vhost.isWordpressAllowed

export default {
  getVhostList,
  getVhostCount,
  getVhostFiltersList,
  getVhostFilters,
  isWordpressAllowed,
}
