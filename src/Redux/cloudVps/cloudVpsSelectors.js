const getPremiumTariffs = state => state.cloudVps.premiumTariffs
const getBasicTariffs = state => state.cloudVps.basicTariffs
const getOperationSystems = state => state.cloudVps.operationSystems

const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters
const getDClist = state => state.cloudVps.instancesDcList
const getWindowsTag = state => state.cloudVps.windowsTag
const getSshList = state => state.cloudVps.sshList
const getSshCount = state => state.cloudVps.sshCount
const getAllSshList = state => state.cloudVps.allSshList
const getSoldOutTag = state => state.cloudVps.soldOutTag

export default {
  getPremiumTariffs,
  getBasicTariffs,
  getOperationSystems,
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
  getDClist,
  getWindowsTag,
  getSshList,
  getSshCount,
  getAllSshList,
  getSoldOutTag,
}
