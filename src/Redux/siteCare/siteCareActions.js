import { createAction } from '@reduxjs/toolkit'

const setSiteCareList = createAction('SET_SITECARE_LIST')
const deleteSiteCare = createAction('DELETE_SITECARE')

const setSiteCareFiltersLists = createAction('SET_SITECARE_FILTERS_LISTS')
const setSiteCareFilters = createAction('SET_SITECARE_FILTERS')

const setSiteCareCount = createAction('SET_SITECARE_COUNT')

export default {
  setSiteCareList,
  deleteSiteCare,
  setSiteCareFiltersLists,
  setSiteCareFilters,
  setSiteCareCount,
}
