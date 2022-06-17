import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  SharedHostingFilter,
  Pagination,
  SharedHostingTable,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './SharedHosting.module.scss'
import { vhostSelectors, vhostOperations } from '../../../Redux'

export default function ServicesPage() {
  const { t } = useTranslation(['container', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()

  const vhostList = useSelector(vhostSelectors.getVhostList)
  const vhostCount = useSelector(vhostSelectors.getVhostCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(vhostOperations.getVhosts(data))
  }, [currentPage])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  console.log(vhostList)

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('services.Shared hosting', { ns: 'other' })}</h1>
      <SharedHostingFilter selctedItem={selctedItem} setCurrentPage={setCurrentPage} />
      <SharedHostingTable
        selctedItem={selctedItem}
        setSelctedItem={setSelctedItem}
        list={vhostList}
      />
      {vhostList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(vhostCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}
