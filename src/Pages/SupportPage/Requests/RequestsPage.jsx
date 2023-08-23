import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SupportFilter, SupportTable, Pagination, Loader } from '@components'
import { supportSelectors, supportOperations } from '@redux'
import s from './RequestsPage.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const tickerList = useSelector(supportSelectors.getTicketList)
  const tickerCount = useSelector(supportSelectors.getTicketCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [selctedTicket, setSelctedTicket] = useState(null)
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    dispatch(supportOperations.getDepartmenList(signal))
    dispatch(supportOperations.getServiceList(signal))
  }, [])

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(supportOperations.getTicketsHandler(data, signal, setIsLoading))
  }, [p_num, p_cnt])

  const destructuredTickerList = [...tickerList]
  const sortedList = destructuredTickerList.sort(
    (a, b) => new Date(b.last_message_utc.$) - new Date(a.last_message_utc.$),
  )

  return (
    <div data-testid="request_support" className={s.content}>
      <SupportFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || tickerList?.length > 0}
        selctedTicket={selctedTicket}
        p_cnt={p_cnt}
        setCurrentPage={setP_num}
        signal={signal}
        setIsLoading={setIsLoading}
      />
      <h2 className={s.tickerCount}>
        {t('all_requests')} <span className={s.count}>({tickerCount})</span>
      </h2>
      {sortedList?.length > 0 && (
        <SupportTable
          list={sortedList}
          setSelctedTicket={setSelctedTicket}
          selctedTicket={selctedTicket}
        />
      )}
      {tickerCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(tickerCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => setP_num(page)}
            onPageItemChange={items => setP_cnt(items)}
          />
        </div>
      )}

      {isLoading && <Loader local shown={isLoading} transparent />}
    </div>
  )
}
