import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Pagination } from '../../../../Components/'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'

import s from './DedicsHistoryModal.module.scss'
import HistoryList from './HistoryList/HistoryList'

export default function DedicsHistoryModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const [currentPage, setCurrentPage] = useState(1)
  const [historyData, setHistoryData] = useState([])
  const [historyElems, setHistoryElems] = useState()

  useEffect(() => {
    dispatch(dedicOperations.getServiceHistory(elid, '', setHistoryData, setHistoryElems))
  }, [])

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

  return (
    <>
      <div className={s.history_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>
              {t('Service change history', { ns: 'other' })}
            </h3>
            <p className={s.service_name}>{'name of service'}</p>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>

        <div className={s.scroll_content}>
          <div className={s.list}>{<HistoryList historyList={historyData} />}</div>

          <div className={s.pagination}>
            <Pagination
              currentPage={currentPage}
              totalCount={Number(historyElems?.$)}
              pageSize={10}
              onPageChange={page => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
