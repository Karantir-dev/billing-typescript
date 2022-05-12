import React, { useEffect } from 'react'
import PersonalSettings from './PersonalSettings/PersonalSettings'
import AccessSettings from './AccessSettings/AccessSettings'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { settingsOperations, userSelectors } from '../../Redux'
import checkIfComponentShouldRender from '../../checkIfComponentShouldRender'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { PageTabBar } from '../../Components/'
import s from './UserSettings.module.scss'
import * as route from '../../routes'
import { toast } from 'react-toastify'

export default function Component() {
  const { t } = useTranslation(['user_settings', 'other', 'trusted_users'])
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()

  const userInfo = useSelector(userSelectors.getUserInfo)

  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)

  const isComponentAllowedToRender = checkIfComponentShouldRender(
    currentSessionRights,
    'customer',
    'usrparam',
  )
  console.log('component in user settings')

  const tavBarSections = [
    { route: `${route.USER_SETTINGS}/personal`, label: t('Personal settings') },
    { route: `${route.USER_SETTINGS}/access`, label: t('Password and access') },
  ]

  console.log('allow to render', isComponentAllowedToRender)
  // func doesn't have any differences

  useEffect(() => {
    if (userInfo?.$id) {
      dispatch(settingsOperations.getUserEdit(userInfo?.$id))
    }
  }, [userInfo])

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
        position: 'bottom-right',
      })
    }
  }, [])

  if (location.pathname === route.USER_SETTINGS) {
    return <Navigate to={`${route.USER_SETTINGS}/personal`} />
  }

  const renderPage = path => {
    if (path === 'personal' && isComponentAllowedToRender) {
      return <PersonalSettings />
    } else if (path === 'access' && isComponentAllowedToRender) {
      return <AccessSettings />
    } else {
      return <Navigate to={route.HOME} />
    }
  }

  if (!isComponentAllowedToRender) {
    return <Navigate to={route.HOME} />
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
