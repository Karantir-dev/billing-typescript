import { useEffect, useState } from 'react'
import PersonalSettings from './PersonalSettings/PersonalSettings'
import AccessSettings from './AccessSettings/AccessSettings'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { settingsOperations, userSelectors } from '@redux'
import { usePageRender } from '@utils'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { PageTabBar } from '@components'
import s from './UserSettings.module.scss'
import * as route from '@src/routes'
import { toast } from 'react-toastify'

export default function Component() {
  const { t } = useTranslation(['user_settings', 'other', 'trusted_users'])
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()

  const userInfo = useSelector(userSelectors.getUserInfo)
  const [availableEditRights, setAvailableEditRights] = useState({})

  const isComponentAllowedToRender = usePageRender('customer', 'usrparam')

  const isComponentAllowedToEdit = availableEditRights?.form?.buttons?.button?.some(
    button => button.$name === 'ok',
  )

  const tavBarSections = [
    {
      route: `${route.USER_SETTINGS}/personal`,
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
    return <Navigate to={`${route.USER_SETTINGS}/personal`} />
  }

  const renderPage = path => {
    if (path === 'personal' && isComponentAllowedToRender) {
      return <PersonalSettings isComponentAllowedToEdit={isComponentAllowedToEdit} />
    } else if (path === 'access' && isComponentAllowedToRender) {
      return <AccessSettings isComponentAllowedToEdit={isComponentAllowedToEdit} />
    } else {
      return <Navigate to={route.ERROR_PAGE} />
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
