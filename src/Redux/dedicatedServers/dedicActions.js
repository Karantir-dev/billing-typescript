import { createAction } from '@reduxjs/toolkit'

const setFilterList = createAction('SET_FILTER_LIST')
const setTarifList = createAction('SET_TARIF_LIST')
const setServersList = createAction('SET_SERVERS_LIST')
const setDedicCount = createAction('SET_DEDIC_COUNT')
const setVDSList = createAction('SET_VDS_LIST')
const setVDSServersList = createAction('SET_VDS_SERVERS_LIST')
const setVDSCount = createAction('SET_VDS_COUNT')
const setIsVdsXlOrdered = createAction('SET_IS_VDS_XL_ORDERED')

export default {
  setFilterList,
  setTarifList,
  setServersList,
  setDedicCount,
  setVDSList,
  setVDSServersList,
  setVDSCount,
  setIsVdsXlOrdered,
}
