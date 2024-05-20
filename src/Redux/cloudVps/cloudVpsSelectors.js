const getPremiumTariffs = state => state.cloudVps.premiumTariffs
const getBasicTariffs = state => state.cloudVps.basicTariffs
const getPremiumOperationSystems = state => state.cloudVps.premiumOperationSystems
const getBasicOperationSystems = state => state.cloudVps.basicOperationSystems

const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters
const getDClist = state => state.cloudVps.instancesDcList
const getWindowsTag = state => state.cloudVps.windowsTag
const getSshList = state => state.cloudVps.sshList
const getSshCount = state => state.cloudVps.sshCount
const getAllSshList = state => state.cloudVps.allSshList
// const getCloudBasicTag = state => state.cloudVps.cloudBasicTag

export default {
  getPremiumTariffs,
  getBasicTariffs,
  getPremiumOperationSystems,
  getBasicOperationSystems,
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
  getDClist,
  getWindowsTag,
  // getCloudBasicTag,
  getSshList,
  getSshCount,
  getAllSshList,
}
