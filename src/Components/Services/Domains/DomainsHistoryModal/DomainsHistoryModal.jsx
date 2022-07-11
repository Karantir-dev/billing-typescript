import React from 'react'
import DomainsHistoryItem from './DomainsHistoryItem'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Pagination } from '../../..'
import cn from 'classnames'
import s from './DomainsHistoryModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const {
    name,
    historyList,
    closeHistoryModalHandler,
    setHistoryCurrentPage,
    historyCurrentPage,
    historyItemCount,
  } = props

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>
          {t('Service change history')} - {name}
        </span>
        <Cross onClick={closeHistoryModalHandler} className={s.crossIcon} />
      </div>
      <div className={s.table}>
        <div className={s.tableHeader}>
          <span className={cn(s.title_text, s.first_item)}>{t('Date of change')}:</span>
          <span className={cn(s.title_text, s.second_item)}>{t('Change')}:</span>
          <span className={cn(s.title_text, s.third_item)}>{t('Username')}:</span>
          <span className={cn(s.title_text, s.fourth_item)}>{t('IP address')}:</span>
        </div>
        <div className={s.tableItems}>
          {historyList?.map((el, index) => {
            const { changedate, desc, ip, user } = el

            return (
              <DomainsHistoryItem
                key={index}
                changedate={changedate?.$}
                desc={desc?.$}
                ip={ip?.$}
                user={user?.$}
              />
            )
          })}
        </div>
      </div>
      {historyItemCount > 10 && (
        <div className={s.total}>
          <div className={s.pagination}>
            <Pagination
              currentPage={historyCurrentPage}
              totalCount={Number(historyItemCount)}
              pageSize={10}
              onPageChange={page => setHistoryCurrentPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  )
}