import { createAction } from '@reduxjs/toolkit'

const setFilterList = createAction('SET_FILTER_LIST')
const setTarifList = createAction('SET_TARIF_LIST')
const setServersList = createAction('SET_SERVERS_LIST')
const setDedicCount = createAction('SET_DEDIC_COUNT')
const setVDSList = createAction('SET_VDS_LIST')

export default {
  setFilterList,
  setTarifList,
  setServersList,
  setDedicCount,
  setVDSList,
}
