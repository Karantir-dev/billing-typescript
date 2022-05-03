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

        const periods = data.doc.slist[0].val.map(({ $, $key }) => {
          return { label: $, value: $key }
        })
        setFormOptions(periods)

        if (data.doc?.period?.$) {
          setFixedPeriod(data.doc.period.$)
        }

        const tableData = data.doc?.reportdata?.reward?.elem
        console.log(tableData)
        if (tableData) {
          let modifiedTableData = []
          if (Array.isArray(tableData)) {
            modifiedTableData = tableData.map(({ amount }) => {
              return { amount: amount.$, date: amount.$id }
            })
          } else {
            modifiedTableData = [
              { amount: tableData.amount.$, date: tableData.amount.$id },
            ]
          }
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

        const tableData = data.doc?.reportdata?.reward?.elem

        if (tableData) {
          let modifiedTableData = []
          if (Array.isArray(tableData)) {
            modifiedTableData = tableData.map(({ amount }) => {
              return { amount: amount.$, date: amount.$id }
            })
          } else {
            modifiedTableData = [
              { amount: tableData.amount.$, date: tableData.amount.$id },
            ]
          }

          setTableData(modifiedTableData)
        }

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        console.log('getChartInfo - ', err.message)
      })
  }

const getDayDetails = (date, setDetails) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client.reward.detail',
        auth: sessionId,
        elid: date,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      console.log(data)
      setDetails(data.doc.reportdata.reward.elem)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('getDayDetails - ', err.message)
    })
}

const getInitialStatistics =
  (setItems, setTotal, setPageNumber, setpageCount) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click',
          auth: sessionId,
          out: 'json',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data)

        setItems(data.doc.elem)
        setTotal(data.doc.p_elems.$)
        setPageNumber(data.doc.p_num.$)
        setpageCount(data.doc.page.length)
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        console.log('getInitialStatistics - ', err.message)
      })
  }

export default {
  getReferralLink,
  getInitialIncomeInfo,
  getChartInfo,
  getDayDetails,
  getInitialStatistics,
}
