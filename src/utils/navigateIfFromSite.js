import { VDS_IDS_TO_ORDER } from './constants'
import * as route from '@src/routes'

const navigateIfFromSite = (data, navigate) => {
  data = JSON.parse(data)
  const funcName = data?.func

  if (funcName === 'vds.order.param') {
    const pricelist = data?.pricelist

    if (VDS_IDS_TO_ORDER.includes(pricelist)) {
      return navigate(route.DEDICATED_SERVERS_ORDER, {
        replace: true,
        state: { isDedicOrderAllowed: true },
      })
    }

    return navigate(route.VPS_ORDER, {
      replace: true,
    })
  } else if (funcName === 'domain.order.name') {
    return navigate(route.DOMAINS_ORDERS, {
      replace: true,
    })
  } else if (funcName === 'vhost.order.param') {
    return navigate(route.SHARED_HOSTING_ORDER, {
      replace: true,
    })
  } else if (funcName === 'wordpress.order.param') {
    return navigate(route.WORDPRESS_ORDER, {
      replace: true,
    })
  } else if (funcName === 'forexbox.order.param') {
    return navigate(route.FOREX_ORDER, {
      replace: true,
    })
  } else if (funcName === 'storage.order.param') {
    return navigate(route.FTP_ORDER, {
      replace: true,
    })
  } else if (funcName === 'dedic.order.param') {
    return navigate(route.DEDICATED_SERVERS_ORDER, {
      replace: true,
    })
  } else if (funcName === 'v2.instances.order.param') {
    return navigate(`${route.CLOUD_VPS_CREATE_INSTANCE}/${data?.category}`, {
      replace: true,
    })
  }
}

export default navigateIfFromSite
