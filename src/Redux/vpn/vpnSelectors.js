const getVpnList = state => state.vpn.vpnList
const getVpnCount = state => state.vpn.vpnCount

const getVpnFiltersList = state => state.vpn.vpnFiltersList
const getVpnFilters = state => state.vpn.vpnFilters
const getIsLoadingVpn = state => state.vpn.isLoadingVpn


export default {
  getVpnList,
  getVpnCount,
  getVpnFiltersList,
  getVpnFilters,
  getIsLoadingVpn
}
