import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import i18next from 'i18next'
import dayjs from 'dayjs'

import s from './Container.module.scss'
import {
  authSelectors,
  userOperations,
  // userSelectors,
  // usersOperations,
  // usersSelectors,
} from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'

export default function Component({ children }) {
  dayjs.locale(i18next.language)

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)

  useEffect(() => {
    dispatch(userOperations.getUserInfo(sessionId, setLoading))
  }, [])

  //cannot modify rights for itself//

  if (loading) {
    return <></>
  }

  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
      <div className={s.container}>{children}</div>
    </>
  )
}
