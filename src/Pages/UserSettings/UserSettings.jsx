import React, { useEffect } from 'react'
import PersonalSettings from './PersonalSettings/PersonalSettings'
import AccessSettings from './AccessSettings/AccessSettings'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { settingsOperations, userSelectors } from '../../Redux'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { PageTabBar } from '../../Components/'
import s from './UserSettings.module.scss'
import * as route from '../../routes'

export default function Component() {
  const { t } = useTranslation(['user_settings', 'other'])
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()

  const userInfo = useSelector(userSelectors.getUserInfo)

  useEffect(() => {
    if (userInfo?.$id) {
      dispatch(settingsOperations.getUserEdit(userInfo?.$id))
    }
  }, [userInfo])

  if (location.pathname === route.USER_SETTINGS) {
    return <Navigate to={`${route.USER_SETTINGS}/personal`} />
  }

  const tavBarSections = [
    { route: `${route.USER_SETTINGS}/personal`, label: t('Personal settings') },
    { route: `${route.USER_SETTINGS}/access`, label: t('Password and access') },
  ]

  const renderPage = path => {
    if (path === 'personal') {
      return <PersonalSettings />
    } else if (path === 'access') {
      return <AccessSettings />
    }
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{userInfo?.$email}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{renderPage(params?.path)}</div>
      </div>
    </>
  )
}
