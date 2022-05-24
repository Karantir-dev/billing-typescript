import React from 'react'
import { BreadCrumbs, DomainFilters } from '../../../Components'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './DomainsPage.module.scss'

export default function ServicesPage() {
  const { t } = useTranslation(['container', 'trusted_users'])

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('burger_menu.services.services_list.domains')}</h1>
      <DomainFilters />
    </div>
  )
}
