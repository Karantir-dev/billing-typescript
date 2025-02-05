import qs from 'qs'
import { toast } from 'react-toastify'
import { actions, cartActions, dedicActions, vdsOperations } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import {
  checkIfTokenAlive,
  replaceAllFn,
  handleLoadersClosing,
  renameAddonFields,
} from '@utils'
import i18n from '@src/i18n'
import * as route from '@src/routes'

// GET SERVERS OPERATIONS

const getServersList = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading(true)

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
      { signal },
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

      setIsLoading(false)
    })
    .catch(error => {
      handleLoadersClosing(error?.message, dispatch, setIsLoading)
      checkIfTokenAlive(error.message, dispatch, true)
    })
}

//ORDER NEW SERVER OPERATIONS
const getTarifs =
  (period, setDedicInfoList, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    Promise.all([
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'dedic.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          datacenter: 7,
          period,
        }),
        { signal },
      ),
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'dedic.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          datacenter: 8,
          period,
        }),
        { signal },
      ),
      axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/service/dedic/`),
    ])
      .then(([firstDatacenterResp, secondDatacenterResp, dedicInfoResp]) => {
        const { data: firstDatacenterData } = firstDatacenterResp
        const { data: secondDatacenterData } = secondDatacenterResp
        const { data: dedicInfoData } = dedicInfoResp

        if (firstDatacenterData.doc.error)
          throw new Error(firstDatacenterData.doc.error.msg.$)

        const { val: firstFpricelist } = firstDatacenterData.doc.flist
        const { val: secondFpricelist } = secondDatacenterData.doc.flist

        const transformToArray = data => (Array.isArray(data) ? data : [data])

        const fpricelist = [
          ...transformToArray(firstFpricelist),
          ...transformToArray(secondFpricelist),
        ].filter((obj, index, self) => index === self.findIndex(o => o.$key === obj.$key))

        const { elem: firstTarifList } =
          firstDatacenterData.doc.list.find(el => el?.$name === 'tariflist') || {}

        const { elem: secondTarifList } =
          secondDatacenterData.doc.list.find(el => el?.$name === 'tariflist') || {}

        const tarifList = [...firstTarifList, ...secondTarifList].filter(
          (obj, index, self) => index === self.findIndex(o => o.desc.$ === obj.desc.$),
        )

        const { val: period } =
          firstDatacenterData.doc.slist.find(el => el.$name === 'period') || {}

        const orderData = {
          fpricelist,
          tarifList,
          period,
        }
        setDedicInfoList(dedicInfoData.services)
        // setNewVds(vdsResp.data?.doc?.list[0]?.elem)
        dispatch(dedicActions.setTarifList(orderData))
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getUpdatedTarrifs =
  (datacenterId, period, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)

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
          period,
          lang: 'en',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const { val: fpricelist } = data.doc.flist
        const { elem: tarifList } =
          data.doc.list.find(el => el?.$name === 'tariflist') || {}
        const { val: datacenter } =
          data.doc.slist.find(el => el?.$name === 'datacenter') || {}
        const { val: period } = data.doc.slist.find(el => el.$name === 'period') || {}
        const { $: currentDatacenter } = data.doc.datacenter

        const orderData = {
          fpricelist: Array.isArray(fpricelist) ? fpricelist : [fpricelist],
          tarifList,
          datacenter,
          period,
          currentDatacenter,
        }

        dispatch(dedicActions.setTarifList(orderData))
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getParameters =
  (period, pricelist, setParameters, setFieldValue, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.dedic.order.param',
          out: 'json',
          auth: sessionId,
          period,
          pricelist,
          lang: 'en',
          licence_agreement: 'on',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        setParameters(renameAddonFields(data.doc, { isNewFunc: true }))
        setIsLoading(false)
      })

      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const updatePrice =
  (
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
    signal,
    setIsLoading,
  ) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.dedic.order.param',
          out: 'json',
          auth: sessionId,
          period,
          pricelist,
          [managePanelName]: managePanel,
          lang: 'en',
          [ipName]: ipTotal,
          [portSpeedName]: portSpeed,
          licence_agreement: 'on',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let price = data.doc.list?.find(item => item.$name === 'pricelist_summary')
          .elem[0].cost.price.cost.$

        updatePrice(price)
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const orderServer =
  (
    autoprolong,
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
    signal,
    setIsLoading,
  ) =>
  (dispatch, getState) => {
    setIsLoading(true)

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DEDICATED_SERVERS,
          }),
        )
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
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
const getCurrentDedicInfo = (elid, params, setParameters) => (dispatch, getState) => {
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
        ...params,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      setParameters(renameAddonFields(data.doc, { isEditFunc: true }))
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
    server_name,
    Port_speed,
    PortSpeedName,
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
          [PortSpeedName]: Port_speed,
          ip,
          username,
          userpassword,
          server_name,
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
  ({
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
    server_name,
    Port_speed,
    PortSpeedName,
    handleModal,
    signal,
    setIsLoading,
  }) =>
  (dispatch, getState) => {
    setIsLoading(true)

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
          autoprolong: autoprolong || undefined,
          domain: domain || undefined,
          ostempl: ostempl || undefined,
          recipe: recipe || undefined,
          [managePanelName]: managePanel,
          [PortSpeedName]: Port_speed,
          [ipName]: ipTotal,
          ip: ip || undefined,
          username: username || undefined,
          userpassword: userpassword || undefined,
          password: password || undefined,
          clicked_button: 'ok',
          server_name: server_name || undefined,
          sok: 'ok',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
        dispatch(getServersList({ p_num: 1 }, signal, setIsLoading))
        setIsLoading(false)

        handleModal && handleModal()
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
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
    portSpeed,
    portSpeedName,
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
          [portSpeedName]: portSpeed,
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
const getIPList =
  (elid, setIPlist, setRights, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        setRights(data?.doc?.metadata?.toolbar)
        setIPlist(data.doc.elem)
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
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

      if (isVds) {
        //SALE_55_PROMOCODE && SALE_55_PROMOCODE?.length > 0
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
        } else if (pageName === 'vpn') {
          routeAfterBuying = route.VPN
        } else if (pageName === 'site_care') {
          routeAfterBuying = route.SITE_CARE
        } else if (pageName === 'vds') {
          routeAfterBuying = route.VPS
        } else if (pageName === 'ftp') {
          routeAfterBuying = route.FTP
        } else if (pageName === 'dns') {
          routeAfterBuying = route.DNS
        } else if (pageName === 'forex') {
          routeAfterBuying = route.FOREX
        } else if (pageName === 'shared_hosting') {
          routeAfterBuying = route.SHARED_HOSTING
        } else if (pageName === 'wordpress') {
          routeAfterBuying = route.WORDPRESS
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
        } else if (pageName === 'vpn') {
          routeAfterBuying = route.VPN
        } else if (pageName === 'site_care') {
          routeAfterBuying = route.SITE_CARE
        } else if (pageName === 'vds') {
          routeAfterBuying = route.VPS
        } else if (pageName === 'ftp') {
          routeAfterBuying = route.FTP
        } else if (pageName === 'dns') {
          routeAfterBuying = route.DNS
        } else if (pageName === 'forex') {
          routeAfterBuying = route.FOREX
        } else if (pageName === 'shared_hosting') {
          routeAfterBuying = route.SHARED_HOSTING
        } else if (pageName === 'wordpress') {
          routeAfterBuying = route.WORDPRESS
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

      setInstructionLink(data.doc.body.$)
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
  (setFilters, data = {}, filtered = false, setEmptyFilter, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          setEmptyFilter && setEmptyFilter(true)
          return dispatch(
            getServersList({ p_num: 1, p_cnt: data?.p_cnt }, signal, setIsLoading),
          )
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
        setIsLoading(false)
      })
      .catch(error => {
        if (error.message.includes('filter')) {
          dispatch(getServersList({ p_num: 1 }, signal, setIsLoading))
        }
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const deleteDedic = (id, closeFn, signal, setIsLoading) => (dispatch, getState) => {
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
        elid: id.join(', '),
        autoprolong: 'null',
        clicked_button: 'basket',
        sok: 'ok',
      }),
    )
    .then(() => {
      return axiosInstance.post(
        '/',
        qs.stringify({
          func: 'dedic.delete',
          auth: sessionId,
          elid: id.join(', '),
          out: 'json',
          lang: 'en',
        }),
      )
    })
    .then(({ data }) => {
      if (data.doc.error) {
        if (data.doc.error.$type === 'pricelist_min_order') {
          const strings = data?.doc?.error?.msg?.$?.split('.')
          const parsePrice = price => {
            const words = price?.match(/[\d|.|\\+]+/g)
            const amounts = []

            if (words.length > 0) {
              words.forEach(w => {
                if (!isNaN(w)) {
                  amounts.push(w)
                }
              })
            } else {
              return
            }

            return amounts[0]
          }

          const min = parsePrice(strings[0])
          const left = parsePrice(strings[1])
          toast.error(
            `${i18n.t(
              'The minimum order period for this service is {{min}}. {{left}} are left',
              { ns: 'other', min: min, left: left },
            )}`,
          )
          dispatch(getServersList({ p_num: 1 }, signal, setIsLoading))
          closeFn()
          dispatch(actions.hideLoader())
          return
        }

        throw new Error(data.doc.error.msg.$)
      }

      dispatch(getServersList({}, signal, setIsLoading))
      closeFn()

      toast.success(
        i18n.t('server_deleted_success', { ns: 'other', id: `#${id.join(', #')}` }),
      )

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      closeFn()

      dispatch(actions.hideLoader())
    })
}

export default {
  getTarifs,
  getUpdatedTarrifs,
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
  deleteDedic,
}
