import { useEffect, useState } from 'react'
import PersonalSettings from './PersonalSettings/PersonalSettings'
import AccessSettings from './AccessSettings/AccessSettings'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { settingsOperations, userSelectors } from '@redux'
import { useCancelRequest, usePageRender } from '@utils'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { Loader, PageTabBar } from '@components'
import s from './UserSettings.module.scss'
import * as route from '@src/routes'
import { toast } from 'react-toastify'
import ErrorPage from '../ErrorPage/ErrorPage'
import cn from 'classnames'

export default function UserSettingsPage() {
  const { t } = useTranslation(['user_settings', 'other', 'trusted_users'])
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const userInfo = useSelector(userSelectors.getUserInfo)
  const [availableEditRights, setAvailableEditRights] = useState({})

  const isComponentAllowedToRender = usePageRender('customer', 'usrparam')

  const isComponentAllowedToEdit = availableEditRights?.form?.buttons?.button?.some(
    button => button.$name === 'ok',
  )

  const tabBarSections = [
    {
      route: route.USER_SETTINGS_PERSONAL,
      label: t('Personal settings'),
      allowToRender: isComponentAllowedToRender,
    },
    {
      route: `${route.USER_SETTINGS}/access`,
      label: t('Password and access'),
      allowToRender: isComponentAllowedToRender,
    },
  ]

  // func doesn't have any differences

  useEffect(() => {
    if (userInfo?.$id) {
      dispatch(
        settingsOperations.getUserEdit(
          userInfo?.$id,
          false,
          isComponentAllowedToRender,
          setAvailableEditRights,
          signal,
          setIsLoading,
        ),
      )
    }
  }, [userInfo])

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
        position: 'bottom-right',
      })
    }
  }, [])

  // useEffect(() => {
  //   if (isComponentAllowedToRender) {
  //     dispatch(usersOperations.getAvailableRights('usrparam', setAvailableEditRights))
  //   }
  // }, [isComponentAllowedToRender])

  if (location.pathname === route.USER_SETTINGS) {
    return <Navigate to={route.USER_SETTINGS_PERSONAL} replace />
  }

  const renderPage = path => {
    if (path === 'personal' && isComponentAllowedToRender) {
      return (
        <PersonalSettings
          isComponentAllowedToEdit={isComponentAllowedToEdit}
          signal={signal}
          setIsLoading={setIsLoading}
        />
      )
    } else if (path === 'access' && isComponentAllowedToRender) {
      return <AccessSettings isComponentAllowedToEdit={isComponentAllowedToEdit} />
    } else {
      return <ErrorPage />
    }
  }

  if (!isComponentAllowedToRender) {
    return <Navigate to={route.HOME} replace />
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{userInfo?.$email}</h1>
        <PageTabBar sections={tabBarSections} />
        <div className={cn(s.content, { [s.disabled]: isLoading })}>
          {renderPage(params?.path)}
          {isLoading && <Loader local shown={isLoading} halfScreen />}
        </div>
      </div>
    </>
  )
}
