import { createAction } from '@reduxjs/toolkit'

const setFilterList = createAction('SET_FILTER_LIST')
const setTarifList = createAction('SET_TARIF_LIST')
const setServersList = createAction('SET_SERVERS_LIST')
const setDedicCount = createAction('SET_DEDIC_COUNT')
const showLoader = createAction('SHOW_LOADER_DEDIC')
const hideLoader = createAction('HIDE_LOADER_DEDIC')

export default {
  setFilterList,
  setTarifList,
  setServersList,
  setDedicCount,
  showLoader,
  hideLoader,
}
