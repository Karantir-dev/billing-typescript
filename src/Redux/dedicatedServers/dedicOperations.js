import qs from 'qs'
import { toast } from 'react-toastify'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
import dedicActions from './dedicActions'
import i18n from './../../i18n'

//GET SERVERS OPERATIONS

const getServersList = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        clickstat: 'yes',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(dedicActions.setServersList(data.doc.elem))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

//ORDER NEW SERVER OPERATIONS
const getTarifs = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log('got tariffs', data)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[0]
      const { $: currentDatacenter } = data.doc.datacenter

      const orderData = {
        fpricelist,
        tarifList,
        datacenter,
        period,
        currentDatacenter,
      }

      dispatch(dedicActions.setTarifList(orderData))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getUpdatedTarrifs = (datacenterId, setNewTariffs) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        datacenter: datacenterId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: period } = data.doc.slist[0]

      const orderData = {
        fpricelist,
        tarifList,
        period,
      }

      setNewTariffs(orderData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getUpdatedPeriod = (period, datacenter, setNewPeriod) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        period,
        datacenter,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]

      const { val: period } = data.doc.slist[0]

      const orderData = {
        fpricelist,
        tarifList,
        period,
      }

      setNewPeriod(orderData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getParameters =
  (period, datacenter, pricelist, setParameters, setFieldValue) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.order.pricelist',
          out: 'json',
          auth: sessionId,
          period,
          datacenter,
          pricelist,
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const IP = Object.keys(data.doc)
        const currentSumIp = IP.filter(
          item => item.includes('addon') && item.includes('current_value'),
        )

        const { slist: paramsList } = data.doc

        const ostempl = paramsList?.filter(item => item.$name === 'ostempl')
        const recipe = paramsList?.filter(item => item.$name === 'recipe')
        const managePanel = paramsList?.filter(item => item.$name.includes('addon'))
        const portSpeed = paramsList?.filter(item => item.$name.includes('addon'))
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const ipName = currentSumIp.join('').slice(0, 10)

        // fields

        setFieldValue('ostemplList', ostempl[0].val)
        setFieldValue('recipelList', recipe[0].val)
        setFieldValue('managePanellList', managePanel[0].val)
        setFieldValue('portSpeedlList', portSpeed[0].val)
        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('ipName', ipName)

        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('ostempl', ostempl[0]?.val[0]?.$key)
        setFieldValue('recipe', recipe[0]?.val[0]?.$key)
        setFieldValue('managePanel', managePanel[0]?.val[0]?.$key)
        setFieldValue('managePanelName', managePanel?.[0]?.$name)
        setFieldValue('portSpeedName', portSpeed?.[1]?.$name)

        setParameters(true)

        dispatch(actions.hideLoader())
      })

      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const updatePrice =
  (
    datacenter,
    period,
    pricelist,
    domain,
    ostempl,
    recipe,
    portSpeed,
    portSpeedName,
    managePanelName,
    ipTotal,
    ipName,
    managePanel,
    updatePrice,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.order.pricelist',
          out: 'json',
          auth: sessionId,
          period,
          datacenter,
          pricelist,
          [managePanelName]: managePanel,
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
          [ipName]: ipTotal,
        }),
      )
      .then(({ data }) => {
        console.log(data, 'newPrice')
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        console.log({ [ipName]: ipTotal })

        let price = data.doc.orderinfo.$.split('Total amount:')[1].replace(' </b>', '')

        updatePrice(price)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderServer =
  (
    autoprolong,
    datacenter,
    period,
    pricelist,
    domain,
    ostempl,
    recipe,
    portSpeed,
    portSpeedName,
    managePanelName,
    ipTotal,
    ipName,
    managePanel,
    setParameters,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.order.param',
          out: 'json',
          auth: sessionId,
          period,
          datacenter,
          pricelist,
          autoprolong,
          domain,
          ostempl,
          recipe,
          [managePanelName]: managePanel,
          licence_agreement: 'on',
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
          [ipName]: ipTotal,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        setParameters(null)
        toast.success(i18n.t('toaster_text', { ns: 'dedicated_servers' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPrintLicense = priceId => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'license.print',
        out: 'doc_print',
        auth: sessionId,
        elid: priceId,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

//EDIT SERVERS OPERATIONS
const getCurrentDedicInfo = (elid, setInitialParams) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        sok: 'ok',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const IP = Object.keys(data.doc.doc)
      const currentSumIp = IP.filter(
        item => item.includes('addon') && item.includes('current_value'),
      )
      const ipamount = data.doc.doc[currentSumIp[0]]

      const findPanelName = Object.keys(data.doc.doc)
      let addonsNames = findPanelName.filter(item => item.includes('addon'))
      let panelName = addonsNames[1]
      let currentPanelValue = data.doc.doc[panelName].$

      const { slist: paramsList } = data.doc.doc
      const {
        domain,
        expiredate,
        cost,
        createdate,
        pricelist,
        recipe,
        period,
        status,
        autoprolong,
        ostempl,
        id,
        ip,
        username,
        userpassword,
        password,
      } = data.doc.doc

      const amountIPName = currentSumIp.join('').slice(0, 10)

      const ostemplL = paramsList?.filter(item => item.$name === 'ostempl')
      const recipeL = paramsList?.filter(item => item.$name === 'recipe')
      const managePanelL = paramsList?.filter(item => item.$name.includes('addon'))
      const autoprolongL = paramsList?.filter(item => item.$name === 'autoprolong')

      // initial form data
      const editModalData = {
        ostemplList: ostemplL[0].val,
        recipelList: recipeL[0].val,
        managePanellList: managePanelL[0].val,
        autoprolonglList: autoprolongL[0].val,

        amountIPName: amountIPName,
        autoprolong,
        ostempl,
        recipe,
        managePanel: currentPanelValue,
        managePanelName: panelName,

        ipamount,
        domain,
        expiredate,
        cost,
        createdate,
        pricelist,
        period,
        status,
        id,
        ip,
        username,
        userpassword,
        password,
      }

      setInitialParams(editModalData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const editDedicServer =
  (
    elid,
    autoprolong,
    domain,
    ostempl,
    recipe,
    managePanel,
    managePanelName,
    ipTotal,
    ipName,
    ip,
    username,
    userpassword,
    password,
    handleModal,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          autoprolong,
          domain,
          ostempl,
          recipe,
          [managePanelName]: managePanel,
          [ipName]: ipTotal,
          ip,
          username,
          userpassword,
          password,
          clicked_button: 'basket',
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const billorder = data?.doc?.billorder?.$

        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'basket',
              auth: sessionId,
              billorder,
              sok: 'ok',
            }),
          )
          .then(data => {
            console.log(data)
            dispatch(actions.hideLoader())

            //open modal for ordering, need to add
          })

        handleModal()
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const updatePriceEditModal =
  (
    elid,
    autoprolong,
    domain,
    ostempl,
    recipe,
    managePanel,
    managePanelName,
    ipTotal,
    ipName,
    ip,
    username,
    userpassword,
    password,
    currentOrder,
    setCurrentAmout,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          autoprolong,
          domain,
          ostempl,
          recipe,
          [managePanelName]: managePanel,
          [ipName]: ipTotal,
          ip,
          username,
          userpassword,
          password,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        setCurrentAmout({ ...currentOrder, ...data.doc.orderinfo })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getTarifs,
  getUpdatedTarrifs,
  getUpdatedPeriod,
  getParameters,
  orderServer,
  updatePrice,
  getPrintLicense,
  getServersList,
  getCurrentDedicInfo,
  editDedicServer,
  updatePriceEditModal,
}
