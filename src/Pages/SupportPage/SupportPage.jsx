import React from 'react'
import Requests from './Requests/RequestsPage'
import RequestsArchive from './RequestsArchive/RequestsArchivePage'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import * as route from '../../routes'

import { PageTabBar } from '../../Components/'
import { usePageRender } from '../../utils'

import s from './SupportPage.module.scss'

export default function Component() {
  const { t } = useTranslation(['support', 'other', 'trusted_users'])
  const params = useParams()

  const isComponentAllowedToRender = usePageRender('support')
  const isArchiveAllowedToRender = usePageRender('support', 'clientticket_archive')
  const isRequestsAllowedToRender = usePageRender('support', 'clientticket')

  const tavBarSections = [
    {
      route: `${route.SUPPORT}/requests`,
      label: t('requests'),
      allowToRender: isComponentAllowedToRender && isRequestsAllowedToRender,
    },
    {
      route: `${route.SUPPORT}/requests_archive`,
      label: t('request_archive'),
      allowToRender: isComponentAllowedToRender && isArchiveAllowedToRender,
    },
  ]

  const renderPage = path => {
    if (path === 'requests') {
      return <Requests />
    } else if (path === 'requests_archive' && !isArchiveAllowedToRender) {
      return <Navigate to={route.HOME} />
    } else if (path === 'requests_archive') {
      return <RequestsArchive />
    }
  }

  if (!isComponentAllowedToRender) {
    return <Navigate to={route.HOME} />
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('support')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{renderPage(params?.path)}</div>
      </div>
    </>
  )
}
