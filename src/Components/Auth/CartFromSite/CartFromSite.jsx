import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { Loader } from '@components'
import { navigateIfFromSite } from '@utils'

export default function CartFromSite(props) {
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuth } = props

  const redirectToLogin = () => {
    navigate(route.LOGIN, {
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

    if (isAuth && data) {
      navigateIfFromSite(data, navigate)
      return
    }

    redirectToLogin()
  }, [])

  return <Loader shown />
}
