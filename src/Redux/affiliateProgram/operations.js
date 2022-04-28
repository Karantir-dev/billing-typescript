import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import authSelectors from '../auth/authSelectors'
import { actions } from '../'
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

const getInitialIncomeInfo =
  (setFormOptions, setTableData, setFixedPeriod) => (dispatch, getState) => {
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

        console.log(data.doc)
        const periods = data.doc.slist[0].val.map(({ $, $key }) => {
          return { label: $, value: $key }
        })
        setFormOptions(periods)
        const tableData = data.doc?.reportdata?.reward?.elem
        if (data.doc?.period?.$) {
          setFixedPeriod(data.doc.period.$)
        }
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

const getChartInfo =
  (setTableData, fixedPeriod, periodStart, periodEnd) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'affiliate.client.reward',
          auth: sessionId,
          out: 'json',
          period: fixedPeriod,
          periodstart: periodStart,
          periodend: periodEnd,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        const tableData = data.doc?.reportdata?.reward?.elem?.map(({ amount }) => {
          return { amount: amount.$, date: amount.$id }
        })
        setTableData(tableData ? tableData : [])

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
