import qs from 'qs'
import { axiosInstance } from '@config/axiosInstance'
import { actions, affiliateActions, authSelectors } from '@redux'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'

const getReferralLink = (signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading(true)
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client',
        auth: sessionId,
        out: 'json',
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      const refLink = data.doc.url.$
      const promocode = data.doc.promocode.$ || 'promocode will be here'

      dispatch(affiliateActions.setReferralLink({ refLink, promocode }))
      setIsLoading(false)
    })
    .catch(err => {
      handleLoadersClosing(err?.message, dispatch, setIsLoading)
      checkIfTokenAlive(err.message, dispatch, true)
    })
}

const getInitialIncomeInfo =
  (setFormOptions, setTableData, setFixedPeriod, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'affiliate.client.reward',
          auth: sessionId,
          out: 'json',
          lang: 'en',
        }),
        { signal },
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

        setIsLoading(false)
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
      })
  }

const getChartInfo =
  (setTableData, fixedPeriod, periodStart, periodEnd, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)
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
        { signal },
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
        } else {
          setTableData([])
        }

        setIsLoading(false)
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
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
      const details = data.doc.reportdata.reward.elem
      setDetails(Array.isArray(details) ? details : [details])
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getInitialStatistics =
  (setItems, setTotal, setPageNumber, setInitialFilters, p_cnt, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)
    const sessionId = authSelectors.getSessionId(getState())

    const responses = Promise.all([
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click',
          auth: sessionId,
          p_cnt,
          out: 'json',
        }),
        { signal },
      ),
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click.filter',
          auth: sessionId,
          out: 'json',
        }),
        { signal },
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
        const datesList = filters.data.doc.slist?.find(el => el.$name === 'cdate')?.val
        setInitialFilters({ date, site, registered, payed, datesList })

        setIsLoading(false)
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
      })
  }

const getFilteredStatistics =
  (
    { date, dateStart, dateEnd, site, registered, payed },
    setItems,
    setTotal,
    p_cnt,
    signal,
    setIsLoading,
  ) =>
  (dispatch, getState) => {
    setIsLoading(true)
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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'affiliate.client.click',
              auth: sessionId,
              p_cnt,
              out: 'json',
            }),
            { signal },
          )
          .then(({ data }) => {
            if (data.doc?.error) throw new Error(data.doc.error.msg.$)

            setItems(data.doc?.elem || [])
            setTotal(data.doc.p_elems.$)

            setIsLoading(false)
          })
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
      })
  }

const getNextPageStatistics =
  (setItems, setTotal, pageNum, p_cnt, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'affiliate.client.click',
          auth: sessionId,
          p_num: pageNum,
          p_cnt,
          out: 'json',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        setItems(data.doc?.elem || [])
        setTotal(data.doc.p_elems.$)

        setIsLoading(false)
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
      })
  }

const dropFilters =
  (setItems, setTotal, p_cnt, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)
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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'affiliate.client.click',
              auth: sessionId,
              p_cnt,
              out: 'json',
            }),
            { signal },
          )
          .then(({ data }) => {
            if (data.doc?.error) throw new Error(data.doc.error.msg.$)

            setItems(data.doc?.elem || [])
            setTotal(data.doc.p_elems.$)

            setIsLoading(false)
          })
      })
      .catch(err => {
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
        checkIfTokenAlive(err.message, dispatch, true)
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
