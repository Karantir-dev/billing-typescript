import { useEffect, useState } from 'react'
import { usePageRender } from '@utils'
import { accessLogsSelectors, accessLogsOperations } from '@redux'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AccessLogsTable, AccessLogsFilter, Pagination } from '@components'
import * as routes from '@src/routes'

import s from './AccessLogPage.module.scss'

export default function Component() {
  const { t } = useTranslation(['access_log', 'other', 'trusted_users'])
  const dispatch = useDispatch()

  const isComponentAllowedToRender = usePageRender('stat', 'authlog')

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const logsList = useSelector(accessLogsSelectors.getLogsList)
  const logsCount = useSelector(accessLogsSelectors.getLogsCount)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(accessLogsOperations.getAccessLogsHandler(data))
  }, [p_num, p_cnt])

  if (!isComponentAllowedToRender) {
    return <Navigate to={routes.HOME} />
  }

  return (
    <div className={s.body}>
      <div className={s.content}>
        <h1 className={s.pageTitle}>{t('access_log')}</h1>
        <AccessLogsFilter p_cnt={p_cnt} setCurrentPage={setP_num} />
        {logsList?.length !== 0 ? (
          <AccessLogsTable list={logsList} />
        ) : (
          <span className={s.noResults}>{t('nothing_found')}</span>
        )}
        {logsCount > 5 && (
          <div className={s.pagination}>
            <Pagination
              totalCount={Number(logsCount)}
              currentPage={p_num}
              pageSize={p_cnt}
              onPageChange={page => setP_num(page)}
              onPageItemChange={items => setP_cnt(items)}
              paginationItemClassName={s.pagination_item}
            />
          </div>
        )}
      </div>
    </div>
  )
}
