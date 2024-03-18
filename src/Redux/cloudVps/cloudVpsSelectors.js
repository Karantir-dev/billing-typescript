const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters
const getInstancesTariffs = state => state.cloudVps.instancesTariffs
const getDClist = state => state.cloudVps.instancesDcList
const getWindowsTag = state => state.cloudVps.windowsTag
const getOsList = state => state.cloudVps.osList
const getSshList = state => state.cloudVps.sshList

export default {
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
  getInstancesTariffs,
  getDClist,
  getWindowsTag,
  getOsList,
  getSshList,
}
