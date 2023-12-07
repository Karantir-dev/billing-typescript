import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  SupportFilter,
  SupportTable,
  Pagination,
  Loader,
  HintWrapper,
  IconButton,
} from '@components'
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

  const [selectedTickets, setSelectedTickets] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    dispatch(supportOperations.getDepartmenList(signal))
    dispatch(supportOperations.getServiceList(signal))
  }, [])

  useEffect(() => {
    const data = { p_num, p_cnt }
    setSelectedTickets([])
    dispatch(supportOperations.getTicketsHandler(data, signal, setIsLoading))
  }, [p_num, p_cnt])

  const destructuredTickerList = [...tickerList]
  const sortedList = destructuredTickerList.sort(
    (a, b) => new Date(b.last_message_utc.$) - new Date(a.last_message_utc.$),
  )

  return (
    <div data-testid="request_support">
      <SupportFilter
        isFiltered={isFiltered}
        setIsFiltered={setIsFiltered}
        isFilterActive={isFiltered || tickerList?.length > 0}
        selectedTickets={selectedTickets}
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
          setSelectedTickets={setSelectedTickets}
          selectedTickets={selectedTickets}
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

      {!!selectedTickets.length && (
        <div className={s.footer}>
          <HintWrapper
            wrapperClassName={s.archiveBtn}
            popupClassName={s.archivePopUp}
            label={t('To the archive')}
          >
            <IconButton
              dataTestid={'archiveBtn'}
              disabled={
                selectedTickets.length
                  ? !selectedTickets.every(ticket => ticket?.toarchive?.$ === 'on')
                  : true
              }
              onClick={() => {
                dispatch(
                  supportOperations.archiveTicketsHandler(
                    selectedTickets.map(el => el?.id?.$).join(', '),
                    setP_num,
                    setSelectedTickets,
                    signal,
                    setIsLoading,
                  ),
                )
              }}
              icon="archive"
            />
          </HintWrapper>
        </div>
      )}

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
