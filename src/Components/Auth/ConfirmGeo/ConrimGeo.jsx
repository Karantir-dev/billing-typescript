import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { authOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { Loader } from '@components'

export default function ConfrimGeo() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const redirectToLogin = redirect => {
    navigate(route.LOGIN, {
      state: {
        redirect: redirect,
      },
      replace: true,
    })
  }

  useEffect(() => {
    const redirect = location.search.match(/redirect=(.+?)(?=&|$)/)?.[1]

    if (redirect) {
      dispatch(authOperations.geoConfirm(redirect, redirectToLogin))
    } else {
      redirectToLogin()
    }
  }, [])

  return <Loader shown />
}
