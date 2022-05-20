import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import authSelectors from '../auth/authSelectors'
import { actions } from '../'
import { affiliateActions } from './actions'
import { errorHandler } from '../../utils'

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
      errorHandler(err.message, dispatch)
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
        errorHandler(err.message, dispatch)
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
        console.log(data)
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
        errorHandler(err.message, dispatch)
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
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getDayDetails - ', err.message)
    })
}

const getInitialStatistics =
  (setItems, setTotal, setPageNumber, setInitialFilters) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    const responses = Promise.all([
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click',
          auth: sessionId,
          p_cnt: 20,
          out: 'json',
        }),
      ),
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click.filter',
          auth: sessionId,
          out: 'json',
        }),
      ),
    ])

    responses
      .then(([items, filters]) => {
        if (items.data.doc?.error) throw new Error(items.data.doc.error.msg.$)

        items.data.doc?.elem && setItems(items.data.doc?.elem)
        setTotal(items.data.doc.p_elems.$)
        setPageNumber(items.data.doc.p_num.$)

        const date = filters.data.doc.cdate?.$
        const site = filters.data.doc.site?.$
        const registered = filters.data.doc.referal?.$
        const payed = filters.data.doc.payed?.$
        setInitialFilters({ date, site, registered, payed })

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('getInitialStatistics - ', err)
      })
  }

const getFilteredStatistics =
  ({ date, dateStart, dateEnd, site, registered, payed }, setItems, setTotal) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

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
              p_cnt: 20,
              out: 'json',
            }),
          )
          .then(({ data }) => {
            if (data.doc?.error) throw new Error(data.doc.error.msg.$)

            setItems(data.doc?.elem || [])
            setTotal(data.doc.p_elems.$)

            dispatch(actions.hideLoader())
          })
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('getFilteredStatistics - ', err.message)
      })
  }

const getNextPageStatistics = (setItems, setTotal, pageNum) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client.click',
        auth: sessionId,
        p_num: pageNum,
        p_cnt: 20,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setItems(data.doc?.elem || [])
      setTotal(data.doc.p_elems.$)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getNextPageStatistics - ', err.message)
    })
}

const dropFilters = (setItems, setTotal) => (dispatch, getState) => {
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

      axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'affiliate.client.click',
            auth: sessionId,
            p_cnt: 20,
            out: 'json',
          }),
        )
        .then(({ data }) => {
          if (data.doc?.error) throw new Error(data.doc.error.msg.$)

          setItems(data.doc?.elem || [])
          setTotal(data.doc.p_elems.$)

          dispatch(actions.hideLoader())
        })
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
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
  getNextPageStatistics,
}
