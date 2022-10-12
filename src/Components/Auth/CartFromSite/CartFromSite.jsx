import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { Loader } from '../../../Components'

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
          return navigate(route.VDS_ORDER)
        } else if (funcName === 'domain.order.name') {
          return navigate(route.DOMAINS_ORDERS)
        } else if (funcName === 'vhost.order.param') {
          console.log('is vhost routed to order?')
          return navigate(route.SHARED_HOSTING_ORDER)
        }
      }
    }

    redirectToLogin()
  }, [])

  return <Loader shown />
}
