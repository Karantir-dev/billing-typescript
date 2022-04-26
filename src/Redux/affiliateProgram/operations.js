import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import authSelectors from '../auth/authSelectors'
import { actions } from '../actions'
import { affiliateActions } from './actions'

const getReferralLink = () => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      const refLink = data.doc.url.$
      const promocode = data.doc.promocode.$ || 'promocode will be here'

      dispatch(affiliateActions.setReferralLink({ refLink, promocode }))
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('getReferralLink - ', err.message)
    })
}

const getInitialIncomeInfo = (setPeriods, setTableData) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client.reward',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      const periods = data.doc.slist[0].val.map(({ $, $key }) => {
        return { label: $, value: $key }
      })
      setPeriods(periods)
      const tableData = data.doc?.reportdata?.reward?.elem
      if (tableData) {
        const modifiedTableData = tableData.map(({ amount }) => {
          return { amount: amount.$, date: amount.$id }
        })
        setTableData(modifiedTableData)
      }

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('getInitialIncomeInfo - ', err.message)
    })
}

const getChartInfo = (setTableData, selectedPeriod) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())
  const periodTypeIsObj = typeof selectedPeriod === 'object'
  const period = periodTypeIsObj ? 'other' : selectedPeriod
  const periodstart = periodTypeIsObj ? selectedPeriod.periodstart : ''
  const periodend = periodTypeIsObj ? selectedPeriod.periodend : ''

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client.reward',
        auth: sessionId,
        out: 'json',
        period,
        periodstart,
        periodend,
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      const tableData = data.doc?.reportdata?.reward?.elem.map(({ amount }) => {
        return { amount: amount.$, date: amount.$id }
      })
      setTableData(tableData)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('getInitialIncomeInfo - ', err.message)
    })
}

export default {
  getReferralLink,
  getInitialIncomeInfo,
  getChartInfo,
}
