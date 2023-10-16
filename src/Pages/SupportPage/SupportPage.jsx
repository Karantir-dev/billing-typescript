import Requests from './Requests/RequestsPage'
import RequestsArchive from './RequestsArchive/RequestsArchivePage'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import * as route from '@src/routes'

import { PageTabBar, PageTitleRender } from '@components'
import { usePageRender } from '@utils'
import ErrorPage from '../ErrorPage/ErrorPage'

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
      return (
        <PageTitleRender title={t('support') + '/' + t('requests')}>
          <Requests />
        </PageTitleRender>
      )
    } else if (path === 'requests_archive' && !isArchiveAllowedToRender) {
      return <Navigate replace to={route.HOME} />
    } else if (path === 'requests_archive') {
      return (
        <PageTitleRender title={t('support') + '/' + t('request_archive')}>
          <RequestsArchive />
        </PageTitleRender>
      )
    } else {
      return <ErrorPage />
    }
  }

  if (!isComponentAllowedToRender) {
    return <Navigate replace to={route.HOME} />
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('support')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content_wrapper}>
          <div className={s.content}>{renderPage(params?.path)}</div>
        </div>
      </div>
    </>
  )
}
