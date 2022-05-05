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
  (setItems, setTotal, setPageNumber, setpageCount, setInitialFilters) =>
  (dispatch, getState) => {
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
        const date = data.doc.p_filter.$.match(/date = ([\s\S]+?),/)?.[1]
        const site = data.doc.p_filter.$.match(/site ~ ([\s\S]+?),/)?.[1]
        const registered =
          data.doc.p_filter.$.match(/registered = ([\s\S]+?),/)?.[1] && 'on'
        const payed = data.doc.p_filter.$.match(/payment = ([\s\S]+?)$/)?.[1] && 'on'

        setInitialFilters({ date, site, registered, payed })
        data.doc?.elem && setItems(data.doc?.elem)
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

const getFilteredStatistics =
  ({ date, dateStart, dateEnd, site, registered, payed }, setItems, setTotal) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())
    console.log('registered', registered)
    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click.filter',
          auth: sessionId,
          cdate: date,
          cdatestart: dateStart,
          cdateend: dateEnd,
          site: site,
          referal: registered,
          payed: payed,
          out: 'json',
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

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
            data.doc?.elem && setItems(data.doc?.elem)
            setTotal(data.doc.p_elems.$)

            dispatch(actions.hideLoader())
          })
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        console.log('getFilteredStatistics - ', err.message)
      })
  }

const dropFilters = () => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client.click.filter',
        auth: sessionId,
        drop: 'on',
        out: 'json',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      console.log(data)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('dropFilters - ', err.message)
    })
}

export default {
  getReferralLink,
  getInitialIncomeInfo,
  getChartInfo,
  getDayDetails,
  getInitialStatistics,
  getFilteredStatistics,
  dropFilters,
}
