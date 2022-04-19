import React from 'react'
import Requests from './Requests/RequestsPage'
import RequestsArchive from './RequestsArchive/RequestsArchivePage'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Container, PageTabBar } from '../../Components/'
import s from './SupportPage.module.scss'

import * as route from '../../routes'

export default function Component() {
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()

  const tavBarSections = [
    { route: `${route.SUPPORT}/requests`, label: t('requests') },
    { route: `${route.SUPPORT}/requests_archive`, label: t('request_archive') },
  ]

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
