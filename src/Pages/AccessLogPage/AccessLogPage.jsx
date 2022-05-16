import React, { useEffect, useRef, useState } from 'react'
import usePageRender from '../../utils/hooks/usePageRender'
import { accessLogsSelectors, accessLogsOperations } from '../../Redux'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { AccessLogsTable, AccessLogsFilter, Pagination } from '../../Components'
import * as routes from '../../routes'

import s from './AccessLogPage.module.scss'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'

export default function MainPage() {
  const { t } = useTranslation(['access_log', 'other', 'trusted_users'])
  const dispatch = useDispatch()

  const isComponentAllowedToRender = usePageRender('stat', 'authlog')

  const tostId = useRef(null)

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

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      if (!toast.isActive(tostId.current)) {
        toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
      }
    }
  }, [])

  if (!isComponentAllowedToRender) {
    return <Navigate to={routes.HOME} />
  }

  return (
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
  )
}
