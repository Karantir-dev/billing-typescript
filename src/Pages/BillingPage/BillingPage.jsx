import React from 'react'
import { useTranslation } from 'react-i18next'
// import { useParams } from 'react-router-dom'
import { PageTabBar } from '../../Components/'
import s from './BillingPgae.module.scss'

import * as route from '../../routes'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])
  //   const params = useParams()

  const tavBarSections = [
    { route: `${route.BILLING}/payments`, label: t('Payments') },
    { route: `${route.BILLING}/expenses`, label: t('Expenses') },
    { route: `${route.BILLING}/automatic_renewal`, label: t('Automatic renewal of services') },
    { route: `${route.BILLING}/auto_payment`, label: t('Auto payment') },
  ]

  //   const renderPage = path => {
  //     if (path === 'requests') {
  //       return <Requests />
  //     } else if (path === 'requests_archive') {
  //       return <RequestsArchive />
  //     }
  //   }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('Finance')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{/* {renderPage(params?.path)} */}</div>
      </div>
    </>
  )
}
