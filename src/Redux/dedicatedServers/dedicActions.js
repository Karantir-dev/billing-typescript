import { createAction } from '@reduxjs/toolkit'

const setFilterList = createAction('SET_FILTER_LIST')
const setTarifList = createAction('SET_TARIF_LIST')

export default {
  setFilterList,
  setTarifList,
}
