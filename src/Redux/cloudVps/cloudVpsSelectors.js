const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters
const getInstancesTariffs = state => state.cloudVps.instancesTariffs

export default {
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
  getInstancesTariffs
}
