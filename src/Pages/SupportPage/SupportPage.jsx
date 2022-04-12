import React from 'react'
import Requests from './Requests/RequestsPage'
import RequestsArchive from './RequestsArchive/RequestsArchivePage'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { Container, PageTabBar } from '../../Components/'
import s from './SupportPage.module.scss'

import * as route from '../../routes'

export default function MainPage() {
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()
  const location = useLocation()

  const tavBarSections = [
    { route: `${route.SUPPORT}/requests`, label: t('requests') },
    { route: `${route.SUPPORT}/requests_archive`, label: t('request archive') },
    { route: `${route.SUPPORT}/requests_archive`, label: t('request archive') },
    { route: `${route.SUPPORT}/requests_archive`, label: t('request archive') },
  ]

  if (location.pathname === route.SUPPORT) {
    return <Navigate to={`${route.SUPPORT}/requests`} />
  }

  const renderPage = path => {
    if (path === 'requests') {
      return <Requests />
    } else if (path === 'requests_archive') {
      return <RequestsArchive />
    }
  }

  return (
    <Container>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('support')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{renderPage(params?.path)}</div>
      </div>
    </Container>
  )
}
