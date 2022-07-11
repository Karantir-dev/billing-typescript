import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SupportFilter, SupportTable, Pagination } from '../../../Components/'
import { supportSelectors, supportOperations } from '../../../Redux'
import s from './RequestsPage.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const tickerList = useSelector(supportSelectors.getTicketList)
  const tickerCount = useSelector(supportSelectors.getTicketCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedTicket, setSelctedTicket] = useState(null)

  useEffect(() => {
    dispatch(supportOperations.getDepartmenList())
    dispatch(supportOperations.getServiceList())
  }, [])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(supportOperations.getTicketsHandler(data))
  }, [currentPage])

  return (
    <div data-testid='request_support'>
      <SupportFilter selctedTicket={selctedTicket} setCurrentPage={setCurrentPage} />
      <h2 className={s.tickerCount}>
        {t('all_requests')} <span className={s.count}>({tickerCount})</span>
      </h2>
      <SupportTable
        list={tickerList}
        setSelctedTicket={setSelctedTicket}
        selctedTicket={selctedTicket}
      />
      {tickerList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(tickerCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}