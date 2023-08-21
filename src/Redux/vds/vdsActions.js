import { createAction } from '@reduxjs/toolkit'

const showLoaderVDS = createAction('SHOW_LOADER_VDS')
const hideLoaderVDS = createAction('HIDE_LOADER_VDS')

export default {
  showLoaderVDS,
  hideLoaderVDS,
}
