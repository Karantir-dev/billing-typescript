const getItemForModals = state => state.cloudVps.itemForModalsReducer
const getInstancesList = state => state.cloudVps.instances
const getInstancesCount = state => state.cloudVps.instancesCount
const getInstancesFilters = state => state.cloudVps.instancesFilters

export default {
  getItemForModals,
  getInstancesList,
  getInstancesCount,
  getInstancesFilters,
}
