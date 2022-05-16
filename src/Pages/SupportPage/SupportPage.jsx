import React, { useEffect, useRef } from 'react'
import Requests from './Requests/RequestsPage'
import RequestsArchive from './RequestsArchive/RequestsArchivePage'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import * as route from '../../routes'

import { PageTabBar } from '../../Components/'
import usePageRender from '../../utils/hooks/usePageRender'

import s from './SupportPage.module.scss'
import { toast } from 'react-toastify'

export default function Component() {
  const { t } = useTranslation(['support', 'other', 'trusted_users'])
  const params = useParams()

  const isComponentAllowedToRender = usePageRender('support')
  const isArchiveAllowedToRender = usePageRender('support', 'clientticket_archive')
  const isRequestsAllowedToRender = usePageRender('support', 'clientticket')

  const tostId = useRef(null)

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
      if (!toast.isActive(tostId.current)) {
        toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
      }

      return <Navigate to={route.HOME} />
    } else if (path === 'requests_archive') {
      return <RequestsArchive />
    }
  }

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
        position: 'bottom-right',
      })
    }
  }, [])

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
