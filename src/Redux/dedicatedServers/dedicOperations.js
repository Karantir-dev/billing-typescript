import qs from 'qs'
import { toast } from 'react-toastify'
import { actions, cartActions, dedicActions, vdsOperations } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { checkIfTokenAlive, replaceAllFn } from '../../utils'
import i18n from './../../i18n'
import * as route from '../../routes'
import { SALE_55_PROMOCODE } from '../../config/config'

// GET SERVERS OPERATIONS

const getServersList = data => (dispatch, getState) => {
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
        p_cnt: data?.p_cnt || 10,
        ...data,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const dedicRenderData = {
        serversList: data.doc.elem ? data.doc.elem : [],
        dedicPageRights: data.doc.metadata.toolbar,
      }

      const count = data?.doc?.p_elems?.$ || 0

      dispatch(dedicActions.setServersList(dedicRenderData))
      dispatch(dedicActions.setDedicCount(count))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
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

      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist.length > 1 ? data.doc.slist[0] : []
      const { val: period } =
        data.doc.slist.length > 1 ? data.doc.slist[1] : data.doc.slist[0]
      const { $: currentDatacenter } = data.doc.datacenter

      const orderData = {
        fpricelist: Array.isArray(fpricelist) ? fpricelist : [fpricelist],
        tarifList,
        datacenter,
        period,
        currentDatacenter,
      }

      dispatch(dedicActions.setTarifList(orderData))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
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
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[1]
      const { $: currentDatacenter } = data.doc.datacenter

      const orderData = {
        fpricelist: Array.isArray(fpricelist) ? fpricelist : [fpricelist],
        tarifList,
        datacenter,
        period,
        currentDatacenter,
      }

      setNewTariffs(orderData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
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
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[1]
      const { $: currentDatacenter } = data.doc.datacenter

      const orderData = {
        fpricelist: Array.isArray(fpricelist) ? fpricelist : [fpricelist],
        tarifList,
        datacenter,
        period,
        currentDatacenter,
      }

      setNewPeriod(orderData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
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

        let ipAddon = ''

        for (let key in data?.doc?.messages?.msg) {
          if (
            data?.doc?.messages?.msg[key]?.toLowerCase()?.includes('ip') &&
            data?.doc?.messages?.msg[key]?.toLowerCase()?.includes('count')
          ) {
            ipAddon = key
          }
        }

        const { slist: paramsList } = data.doc

        const ostempl = paramsList?.filter(item => item.$name === 'ostempl')
        const recipe = paramsList?.filter(item => item.$name === 'recipe')
        const managePanel = paramsList?.filter(item => item.$name.includes('addon'))
        const portSpeed = paramsList?.filter(item => item.$name.includes('addon'))
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const ipSliderData = data.doc?.metadata?.form?.field?.find(
          item => item?.$name === ipAddon,
        )?.slider[0]

        const ipListData = []
        if (ipSliderData) {
          for (let i = 1; i <= ipSliderData.$max; i += Number(ipSliderData.$step)) {
            if (i === 1) {
              const item = { value: i, cost: '0.00' }
              ipListData.push(item)
            } else {
              const item = { value: i, cost: ipSliderData.$cost }
              ipListData.push(item)
            }
          }
        }

        // fields

        setFieldValue('ipList', ipListData)
        setFieldValue('ostemplList', ostempl[0].val)
        setFieldValue('recipelList', recipe[0].val)
        setFieldValue('managePanellList', managePanel[0].val)
        setFieldValue('portSpeedlList', portSpeed.length > 1 ? portSpeed[1].val : [])
        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('ipName', ipAddon)

        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('ostempl', ostempl[0]?.val[0]?.$key)
        setFieldValue('recipe', recipe[0]?.val[0]?.$key)
        setFieldValue('managePanel', managePanel[0]?.val[0]?.$key)
        setFieldValue('managePanelName', managePanel?.[0]?.$name)
        setFieldValue('portSpeedName', portSpeed.length > 1 ? portSpeed?.[1]?.$name : '')

        setParameters(paramsList)

        dispatch(actions.hideLoader())
      })

      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
          [portSpeedName]: portSpeed,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let price = data.doc.orderinfo.$.split('Total amount:')[1].replace(' </b>', '')

        updatePrice(price?.replace('EUR', ''))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
    server_name,
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
          [portSpeedName]: portSpeed,
          server_name: server_name,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DEDICATED_SERVERS,
          }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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

        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const IP = Object.keys(data.doc)
      const currentSumIp = IP.filter(
        item => item.includes('addon') && item.includes('current_value'),
      )
      const ipamount = data.doc[currentSumIp[0]]

      const findPanelName = Object.keys(data.doc)
      let addonsNames = findPanelName.filter(item => item.includes('addon'))
      let panelName = addonsNames[1]
      let currentPanelValue = data.doc[panelName].$

      const { slist: paramsList } = data.doc
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
      } = data.doc

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
      checkIfTokenAlive(error.message, dispatch)
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

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'basket',
              auth: sessionId,
              billorder,
              sok: 'ok',
              lang: 'en',
            }),
          )
          .then(() => {
            dispatch(actions.hideLoader())

            dispatch(
              cartActions.setCartIsOpenedState({
                isOpened: true,
                redirectPath: route.DEDICATED_SERVERS,
              }),
            )
          })

        handleModal()
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editDedicServerNoExtraPay =
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
          clicked_button: 'ok',
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
        dispatch(getServersList({ p_num: 1 }))
        dispatch(actions.hideLoader())

        handleModal()
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

// IP-addresses
const getIPList = (elid, setIPlist, setRights) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip',
        out: 'json',
        auth: sessionId,
        elid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      setRights(data?.doc?.metadata?.toolbar)
      setIPlist(data.doc.elem)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getInfoEditIP = (elid, plid, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip.edit',
        out: 'json',
        auth: sessionId,
        elid,
        plid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const { domain, domain_name, gateway, mask } = data.doc

      setInitialState({ domain, domain_name, gateway, mask })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const editIP =
  (elid, plid, mask, gateway, domain, handleEditionModal) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'service.ip.edit',
          out: 'json',
          auth: sessionId,
          elid,
          plid,
          mask,
          gateway,
          domain,
          clicked_button: 'ok',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        handleEditionModal()

        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const removeIP = (elid, plid, handleRemoveIPModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip.delete',
        out: 'json',
        auth: sessionId,
        elid,
        plid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      toast.success(i18n.t('Service has been successfully removed', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
      handleRemoveIPModal()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      if (
        error.message.trim() ===
        'Resource change is forbidden by provider. Contact technical support'
      ) {
        toast.error(
          i18n.t('Resource change is forbidden by provider. Contact technical support', {
            ns: 'dedicated_servers',
          }),
          {
            position: 'bottom-right',
            toastId: 'customId',
          },
        )
        handleRemoveIPModal()
      }
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const orderIPInfo = (ipPlid, setInitialValues) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip.edit',
        out: 'json',
        auth: sessionId,
        plid: ipPlid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const { val: typeList } = data.doc.slist[0]
      const { count, domain, maxcount } = data.doc

      dispatch(actions.hideLoader())
      setInitialValues({ typeList, count, domain, maxcount })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const orderNewIP =
  (plid, type, maxcount, count, domain, handleCart) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'service.ip.edit',
          out: 'json',
          auth: sessionId,
          plid,
          type,
          maxcount,
          count,
          domain,
          clicked_button: 'basket',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(actions.hideLoader())

        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DEDICATED_SERVERS,
          }),
        )
        handleCart()
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

// PROLONG
const getProlongInfo = (elid, setInitialState, isVds) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.prolong',
        out: 'json',
        auth: sessionId,
        elid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const {
        slist,
        expiredate,
        period,
        title_name,
        newexpiredate,
        status,
        suspendpenaltywarn,
      } = data.doc

      setInitialState({
        slist,
        expiredate,
        newexpiredate,
        period,
        title_name,
        status,
        suspendpenaltywarn,
      })

      const setState = vds => {
        setInitialState({
          slist,
          expiredate,
          newexpiredate,
          period,
          title_name,
          status,
          suspendpenaltywarn,
          vds,
        })
      }

      if (isVds && SALE_55_PROMOCODE && SALE_55_PROMOCODE?.length > 0) {
        return dispatch(vdsOperations.getEditFieldsVDS(elid, setState))
      }
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getProlongInfoForFewElems = (elid, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'groupedit',
        faction: 'service.prolong',
        out: 'json',
        auth: sessionId,
        elid,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const {
        slist,
        expiredate,
        period,
        title_name,
        newexpiredate,
        status,
        suspendpenaltywarn,
      } = data.doc

      setInitialState({
        slist,
        expiredate,
        newexpiredate,
        period,
        title_name,
        status,
        suspendpenaltywarn,
      })
      dispatch(actions.hideLoader())
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getUpdateProlongInfo = (elid, period, setNewExpireDate) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.prolong',
        out: 'json',
        auth: sessionId,
        elid,
        period,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      setNewExpireDate(data.doc.newexpiredate.$)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const payProlongPeriod =
  (elid, period, handleModal, pageName, withSale) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'service.prolong',
          out: 'json',
          auth: sessionId,
          elid,
          period,
          clicked_button: 'basket',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let routeAfterBuying = route.SERVICES

        if (pageName === 'dedics') {
          routeAfterBuying = route.DEDICATED_SERVERS
        } else if (routeAfterBuying === 'vds') {
          routeAfterBuying = route.VDS
        } else if (routeAfterBuying === 'ftp') {
          routeAfterBuying = route.FTP
        } else if (routeAfterBuying === 'dns') {
          routeAfterBuying = route.DNS
        } else if (routeAfterBuying === 'forex') {
          routeAfterBuying = route.FOREX
        }

        handleModal()
        dispatch(actions.hideLoader())
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: routeAfterBuying,
            salePromocode: withSale,
          }),
        )
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const payProlongPeriodFewElems =
  (elid, period = 1, handleModal, pageName) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'groupedit',
          faction: 'service.prolong',
          out: 'json',
          auth: sessionId,
          elid,
          period,
          clicked_button: 'basket',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let routeAfterBuying = route.SERVICES

        if (pageName === 'dedics') {
          routeAfterBuying = route.DEDICATED_SERVERS
        } else if (routeAfterBuying === 'vds') {
          routeAfterBuying = route.VDS
        } else if (routeAfterBuying === 'ftp') {
          routeAfterBuying = route.FTP
        } else if (routeAfterBuying === 'dns') {
          routeAfterBuying = route.DNS
        } else if (routeAfterBuying === 'forex') {
          routeAfterBuying = route.FOREX
        }

        handleModal()
        dispatch(actions.hideLoader())
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: routeAfterBuying,
          }),
        )
      })
      .catch(error => {
        if (
          replaceAllFn(error.message.trim(), String.fromCharCode(39), '"') ===
          'The "Period" field has invalid value.'
        ) {
          toast.warning(i18n.t('The Period field has invalid value.', { ns: 'other' }), {
            position: 'bottom-right',
            toastId: 'customId',
          })
        }
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getServiceHistory =
  (elid, currentPage, setHistoryList, setHistoryElems) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'service.history',
          out: 'json',
          auth: sessionId,
          elid,
          p_cnt: 10,
          p_num: currentPage || null,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem, p_elems } = data.doc

        setHistoryList(elem)
        setHistoryElems(p_elems)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getServiceInstruction = (elid, setInstructionLink) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.instruction.html',
        out: 'json',
        auth: sessionId,
        lang: i18n.language,
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      setInstructionLink(data.doc.body)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const rebootServer = (elid, manageModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.reboot',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      manageModal()

      dispatch(actions.hideLoader())
      toast.success(i18n.t('Server has been successfully rebooted', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const goToPanel = elid => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'gotoserver',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const link = document.createElement('a')
      link.href = data.doc.ok.$
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getDedicFilters =
  (setFilters, data = {}, filtered = false, setEmptyFilter) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          setEmptyFilter && setEmptyFilter(true)
          return dispatch(getServersList({ p_num: 1, p_cnt: data?.p_cnt }))
        }

        let filters = {}

        data?.doc?.slist?.forEach(el => {
          filters[el.$name] = el.val
        })

        let currentFilters = {
          id: data.doc?.id?.$ || '',
          domain: data.doc?.domain?.$ || '',
          ip: data.doc?.ip?.$ || '',
          pricelist: data.doc?.pricelist?.$ || '',
          period: data.doc?.period?.$ || '',
          status: data.doc?.status?.$ || '',
          service_status: data.doc?.service_status?.$ || '',
          opendate: data.doc?.opendate?.$ || '',
          expiredate: data.doc?.expiredate?.$ || '',
          orderdatefrom: data.doc?.orderdatefrom?.$ || '',
          orderdateto: data.doc?.orderdateto?.$ || '',
          cost_from: data.doc?.cost_from?.$ || '',
          cost_to: data.doc?.cost_to?.$ || '',
          autoprolong: data.doc?.autoprolong?.$ || '',
          datacenter: data.doc?.datacenter?.$ || '',
          ostemplate: '',
        }

        setFilters({ filters, currentFilters })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        if (error.message.includes('filter')) {
          dispatch(getServersList({ p_num: 1 }))
        }
        checkIfTokenAlive(error.message, dispatch)
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
  getIPList,
  getInfoEditIP,
  editIP,
  removeIP,
  orderIPInfo,
  orderNewIP,
  editDedicServerNoExtraPay,
  getProlongInfo,
  getUpdateProlongInfo,
  payProlongPeriod,
  getServiceHistory,
  getServiceInstruction,
  rebootServer,
  getDedicFilters,
  goToPanel,
  getProlongInfoForFewElems,
  payProlongPeriodFewElems,
}
