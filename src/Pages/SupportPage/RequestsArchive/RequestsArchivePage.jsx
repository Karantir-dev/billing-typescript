import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SupportFilter, Pagination, SupportArchiveTable } from '../../../Components/'
import { supportSelectors, supportOperations } from '../../../Redux'
import s from './RequestsArchivePage.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])

  const tickerArchiveList = useSelector(supportSelectors.getTicketArchiveList)
  const tickerArchiveCount = useSelector(supportSelectors.getTicketArchiveCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedTicket, setSelctedTicket] = useState(null)
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(supportOperations.getTicketsArchiveHandler(data))
  }, [currentPage])

  return (
    <div data-testid="request_archive">
      <SupportFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || tickerArchiveList?.length > 0}
        setCurrentPage={setCurrentPage}
      />
      <h2 className={s.tickerCount}>
        {t('all_requests')} <span className={s.count}>({tickerArchiveCount})</span>
      </h2>
      {tickerArchiveList?.length > 0 && (
        <SupportArchiveTable
          list={tickerArchiveList}
          setSelctedTicket={setSelctedTicket}
          selctedTicket={selctedTicket}
        />
      )}
      {tickerArchiveList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(tickerArchiveCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}
