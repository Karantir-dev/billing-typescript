import React, { useEffect, useState } from 'react'
import { accessLogsSelectors, accessLogsOperations } from '../../Redux'
import { useTranslation } from 'react-i18next'
import {
  AccessLogsTable,
  AccessLogsFilter,
  Pagination,
  Container,
} from '../../Components'
import { useSelector, useDispatch } from 'react-redux'
import s from './AccessLogPage.module.scss'

export default function MainPage() {
  const { t } = useTranslation(['access_log', 'other'])
  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)

  const logsList = useSelector(accessLogsSelectors.getLogsList)
  const logsCount = useSelector(accessLogsSelectors.getLogsCount)

  useEffect(async () => {
    dispatch(accessLogsOperations.getAccessLogsHandler())
    dispatch(accessLogsOperations.getAccessLogsFiltersHandler())
  }, [])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(accessLogsOperations.getAccessLogsHandler(data))
  }, [currentPage])

  return (
    <Container>
      <div className={s.body}>
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('access_log')}</h1>
          <AccessLogsFilter setCurrentPage={setCurrentPage} />
          {logsList.length !== 0 ? (
            <AccessLogsTable list={logsList} />
          ) : (
            <span className={s.noResults}>{t('nothing_found')}</span>
          )}
          {logsList.length !== 0 && (
            <div className={s.pagination}>
              <Pagination
                currentPage={currentPage}
                totalCount={Number(logsCount)}
                pageSize={30}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
