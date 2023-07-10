import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { Loader } from '@components'

export default function Component(props) {
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuth } = props

  const redirectToLogin = redirect => {
    navigate(route.LOGIN, {
      state: {
        redirect: redirect,
      },
      replace: true,
    })
  }

  useEffect(() => {
    const search = location.search.substring(1)

    const data =
      '{"' +
      decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'

    localStorage.setItem('site_cart', data)

    if (isAuth) {
      if (data) {
        const funcName = JSON.parse(data)?.func
        if (funcName === 'vds.order.param') {
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
        }
      }
    }

    redirectToLogin()
  }, [])

  return <Loader shown />
}
