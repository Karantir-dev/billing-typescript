import React, { useEffect, useState } from 'react'
import accessLogsSelectors from '../../Redux/accessLogs/accessLogsSelectors'
import accessLogsOperations from '../../Redux/accessLogs/accessLogsOperations'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { AccessLogsTable, AccessLogsFilter, Pagination } from '../../Components/'
import { useSelector, useDispatch } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import s from './AccessLogScreen.module.scss'

export default function MainPage() {
  const { t } = useTranslation(['access_log', 'other'])
  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const logsList = useSelector(accessLogsSelectors.getLogsList)
  const logsCount = useSelector(accessLogsSelectors.getLogsCount)

  useEffect(() => {
    dispatch(accessLogsOperations.getAccessLogsHandler())
    dispatch(accessLogsOperations.getAccessLogsFiltersHandler())
  }, [])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(accessLogsOperations.getAccessLogsHandler(data))
  }, [currentPage])

  return (
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
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
                totalCount={logsCount}
                pageSize={15}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
