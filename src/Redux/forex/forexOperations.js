import qs from 'qs'
// import { toast } from 'react-toastify'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
// import i18n from '../../i18n'
// import * as route from '../../routes'
import {
  actions,
  // cartActions,
  forexActions,
} from '..'

//GET hostings OPERATIONS

const getForexList = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'forexbox',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        clickstat: 'yes',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(forexActions.setForexList(data.doc.elem ? data.doc.elem : []))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getForexList,
  // getTarifs,
  // getParameters,
  // updateDNSPrice,
  // orderDNS,
  // getPrintLicense,
  // getCurrentDNSInfo,
  // editDNS,
  // getDNSExtraPayText,
  // editDNSWithExtraCosts,
  // getServiceInstruction,
  // getDNSFilters,
  // getChangeTariffPricelist,
}
