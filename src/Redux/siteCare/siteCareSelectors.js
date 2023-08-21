const getSiteCareList = state => state.sitecare.siteCareList
const getSiteCareCount = state => state.sitecare.siteCareCount

const getSiteCareFiltersList = state => state.sitecare.siteCareFiltersList
const getSiteCareFilters = state => state.sitecare.siteCareFilters
const getIsLoadingSiteCare = state => state.sitecare.isLoadingSiteCare

export default {
  getSiteCareList,
  getSiteCareCount,
  getSiteCareFiltersList,
  getSiteCareFilters,
  getIsLoadingSiteCare,
}
