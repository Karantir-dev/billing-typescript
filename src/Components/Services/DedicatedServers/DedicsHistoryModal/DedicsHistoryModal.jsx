import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
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

        <div className={s.modal_body}>
          <div className={s.list}>{<HistoryList historyList={historyData} />}</div>
        </div>

        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(historyElems?.$)}
            pageSize={10}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  )
}
