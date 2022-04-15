import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SupportFilter, SupportTable, Pagination } from '../../../Components/'
import supportSelectors from '../../../Redux/support/supportSelectors'
import supportOperations from '../../../Redux/support/supportOperations'
import s from './RequestsPage.module.scss'

export default function MainPage() {
  const dispatch = useDispatch()
  const tickerList = useSelector(supportSelectors.getTicketList)
  const tickerCount = useSelector(supportSelectors.getTicketCount)

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(supportOperations.getTicketsHandler())
  }, [])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(supportOperations.getTicketsHandler(data))
  }, [currentPage])

  return (
    <>
      <SupportFilter />
      <h2 className={s.tickerCount}>
        Все запросы <span className={s.count}>({tickerCount})</span>
      </h2>
      <SupportTable list={tickerList} />
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
    </>
  )
}
