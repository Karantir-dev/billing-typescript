const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters
const getInstancesTariffs = state => state.cloudVps.instancesTariffs
const getDClist = state => state.cloudVps.instancesDcList
const getWindowsTag = state => state.cloudVps.windowsTag
const getOperationSystems = state => state.cloudVps.operationSystems
const getSshList = state => state.cloudVps.sshList
const getSshCount = state => state.cloudVps.sshCount
const getAllSshList = state => state.cloudVps.allSshList
const getCloudBasicTag = state => state.cloudVps.cloudBasicTag

export default {
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
  getInstancesTariffs,
  getDClist,
  getWindowsTag,
  getCloudBasicTag,
  getOperationSystems,
  getSshList,
  getSshCount,
  getAllSshList,
}
