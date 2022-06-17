import React, { useEffect } from 'react'
import { BreadCrumbs } from '../../../../Components'
import {} from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './SharedHostingOrder.module.scss'

export default function ServicesPage() {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const location = useLocation()

  useEffect(() => {}, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('Virtual hosting order')}</h1>
    </div>
  )
}
