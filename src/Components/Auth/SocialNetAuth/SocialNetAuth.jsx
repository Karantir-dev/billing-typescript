import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { authOperations, authSelectors } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, VerificationModal } from '../..'

export default function SocialNetAuth() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const formVisibility = useSelector(authSelectors.getTotpFormVisibility)

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
    const redirect = location.search.match(/redirect=(.+?)(?=&|$)/)?.[1]

    if (redirect && !state) {
      navigate(route.GEO_CONFIRM, { replace: true })
    } else {
      if (!state) {
        navigate(route.LOGIN, { replace: true })
      } else {
        dispatch(
          authOperations.checkGoogleState(state, redirectToRegistration, redirectToLogin),
        )
      }
    }
  }, [])

  return formVisibility === 'shown' ? (
    <VerificationModal onClose={() => redirectToLogin()} />
  ) : (
    <Loader shown />
  )
}
