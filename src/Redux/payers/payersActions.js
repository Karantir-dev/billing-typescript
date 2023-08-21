import { createAction } from '@reduxjs/toolkit'

const setPayersList = createAction('SET_PAYERS_LIST')
const setPayersCount = createAction('SET_PAYERS_COUNT')

const setPayersSelectLists = createAction('SET_PAYER_SELECT_LISTS')
const updatePayersSelectLists = createAction('UPDATE_PAYER_SELECT_LISTS')

const setPayersSelectedFields = createAction('SET_PAYER_SELECTED_FILEDS')

const deletePayer = createAction('DELETE_PAYER')

const hideLoader = createAction('SHOW_LOADER_PAYERS')
const showLoader= createAction('HIDE_LOADER_PAYERS')

export default {
  setPayersList,
  setPayersCount,
  deletePayer,
  setPayersSelectLists,
  updatePayersSelectLists,
  setPayersSelectedFields,
  hideLoader,
showLoader
}
