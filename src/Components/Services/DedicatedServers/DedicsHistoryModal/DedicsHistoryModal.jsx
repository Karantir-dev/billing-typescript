import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Pagination } from '../../../../Components/'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import Loader from '../../../ui/Loader/Loader'

import s from './DedicsHistoryModal.module.scss'
import HistoryList from './HistoryList/HistoryList'

export default function DedicsHistoryModal({ elid, closeFn, name }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const [currentPage, setCurrentPage] = useState(1)
  const [historyData, setHistoryData] = useState([])
  const [historyElems, setHistoryElems] = useState(null)
  const widerThan1024 = useMediaQuery({ query: '(min-width: 1024px)' })

  useEffect(() => {
    dispatch(
      dedicOperations.getServiceHistory(
        elid,
        currentPage,
        setHistoryData,
        setHistoryElems,
      ),
    )
  }, [currentPage])

  if (!historyData || !historyElems) {
    return <Loader />
  }

  return (
    <>
      <div className={s.history_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>
              {t('Service change history', { ns: 'other' })}
            </h3>
            <p className={s.service_name}>{name}</p>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>

        {widerThan1024 && (
          <ul className={s.head_row}>
            <li className={s.table_head}>{t('date', { ns: 'other' })}:</li>
            <li className={s.table_head}>{t('Changing', { ns: 'other' })}:</li>
            <li className={s.table_head}>{t('user_name')}:</li>
            <li className={s.table_head}>{t('ip_address')}:</li>
          </ul>
        )}

        <div className={s.modal_body}>
          <div className={s.list}>{<HistoryList historyList={historyData} />}</div>
        </div>

        {historyElems?.$ > 10 && (
          <div className={s.pagination}>
            <Pagination
              currentPage={currentPage}
              totalCount={Number(historyElems?.$)}
              pageSize={10}
              onPageChange={page => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </>
  )
}
