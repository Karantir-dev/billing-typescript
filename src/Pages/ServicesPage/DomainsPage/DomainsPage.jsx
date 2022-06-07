import React, { useEffect, useState } from 'react'
import { BreadCrumbs, DomainFilters, Pagination, DomainsTable } from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './DomainsPage.module.scss'
import { domainsOperations, domainsSelectors } from '../../../Redux'

export default function ServicesPage() {
  const { t } = useTranslation(['container', 'trusted_users'])
  const dispatch = useDispatch()

  const location = useLocation()

  const domainsList = useSelector(domainsSelectors.getDomainsList)
  const domainsCount = useSelector(domainsSelectors.getDomainsCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(domainsOperations.getDomains(data))
  }, [currentPage])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('burger_menu.services.services_list.domains')}</h1>
      <DomainFilters selctedItem={selctedItem} />
      <DomainsTable
        selctedItem={selctedItem}
        setSelctedItem={setSelctedItem}
        list={domainsList}
      />
      {domainsList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(domainsCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}
