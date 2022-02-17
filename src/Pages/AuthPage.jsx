import React from 'react'

import { useSelector } from 'react-redux'
import { authSelectors } from '../Redux/auth/authSelectors'

export function AuthPage({ children }) {
  const isLoading = useSelector(authSelectors.getIsLoadding)

  return (
    <>
      {isLoading ? <div className="loader">Загружаем...</div> : ''}
      {children}
    </>
  )
}
