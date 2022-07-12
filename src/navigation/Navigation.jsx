import React from 'react'
import AuthRoutes from './public/AuthRoutes'
import SecureRoutes from './secure/SecureRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { actions, authSelectors } from '../Redux'
import i18n from 'i18next'

const Component = () => {
  const dispatch = useDispatch()
  i18n.on('languageChanged', () => {
    dispatch(actions.hideLoader())
  })
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  return <>{isAuthenticated ? <SecureRoutes /> : <AuthRoutes />}</>
}

export default Component
