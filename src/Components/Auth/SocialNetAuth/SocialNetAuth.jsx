import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { authOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'
import { Loader } from '../..'

export default function SocialNetAuth() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const redirectToRegistration = (errMsg, name, email) => {
    navigate(route.REGISTRATION, {
      state: { errMsg: errMsg, name: name, email: email },
      replace: true,
    })
  }

  const redirectToLogin = (errMsg, value) => {
    navigate(route.LOGIN, {
      state: { errMsg: errMsg, value },
      replace: true,
    })
  }

  useEffect(() => {
    const state = location.search.match(/state=(.+?)(?=&|$)/)?.[1]
    if (!state) {
      navigate(route.LOGIN, { replace: true })
    } else {
      dispatch(
        authOperations.checkGoogleState(state, redirectToRegistration, redirectToLogin),
      )
    }
  }, [])

  return <Loader shown />
}
