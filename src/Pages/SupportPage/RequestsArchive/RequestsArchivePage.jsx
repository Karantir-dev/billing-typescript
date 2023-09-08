import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SupportFilter, Pagination, SupportArchiveTable, Loader } from '@components'
import { supportSelectors, supportOperations } from '@redux'
import s from './RequestsArchivePage.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])

  const tickerArchiveList = useSelector(supportSelectors.getTicketArchiveList)
  const tickerArchiveCount = useSelector(supportSelectors.getTicketArchiveCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [selctedTicket, setSelctedTicket] = useState(null)
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(supportOperations.getTicketsArchiveHandler(data, signal, setIsLoading))
  }, [p_num, p_cnt])

  return (
    <div data-testid="request_archive">
      <SupportFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || tickerArchiveList?.length > 0}
        p_cnt={p_cnt}
        setCurrentPage={setP_num}
        signal={signal}
        setIsLoading={setIsLoading}
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

      {tickerArchiveCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(tickerArchiveCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => setP_num(page)}
            onPageItemChange={items => setP_cnt(items)}
          />
        </div>
      )}

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
