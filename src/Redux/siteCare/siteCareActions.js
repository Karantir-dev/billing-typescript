import { createAction } from '@reduxjs/toolkit'

const setSiteCareList = createAction('SET_SITECARE_LIST')
const deleteSiteCare = createAction('DELETE_SITECARE')

const setSiteCareFiltersLists = createAction('SET_SITECARE_FILTERS_LISTS')
const setSiteCareFilters = createAction('SET_SITECARE_FILTERS')

const setSiteCareCount = createAction('SET_SITECARE_COUNT')

const showLoader = createAction('SHOW_LOADER_SITECARE')
const hideLoader = createAction('HIDE_LOADER_SITECARE')

export default {
  setSiteCareList,
  deleteSiteCare,
  setSiteCareFiltersLists,
  setSiteCareFilters,
  setSiteCareCount,
  showLoader,
  hideLoader,
}
