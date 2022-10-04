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
        console.log(JSON.parse(data))
        if (JSON.parse(data)?.func === 'vds.order.param') {
          return navigate(route.VDS_ORDER)
        }
      }
    }

    redirectToLogin()
  }, [])

  return <Loader shown />
}
