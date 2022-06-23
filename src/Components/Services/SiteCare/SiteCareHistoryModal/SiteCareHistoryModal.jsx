import React from 'react'
import SiteCareHistoryItem from './SiteCareHistoryItem'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Portal } from '../../..'
import cn from 'classnames'
import s from './SiteCareHistoryModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, historyList, closeHistoryModalHandler } = props

  return (
    <Portal>
      <div className={s.modalBg}>
        <div className={s.modalBlock}>
          <div className={s.modalHeader}>
            <span className={s.headerText}>
              {t('Service change history')} - {name}
            </span>
            <Cross onClick={closeHistoryModalHandler} className={s.crossIcon} />
          </div>
          <div className={s.table}>
            <div className={s.tableHeader}>
              <span className={cn(s.title_text, s.first_item)}>
                {t('Date of change')}:
              </span>
              <span className={cn(s.title_text, s.second_item)}>{t('Change')}:</span>
              <span className={cn(s.title_text, s.third_item)}>{t('Username')}:</span>
              <span className={cn(s.title_text, s.fourth_item)}>{t('IP address')}:</span>
            </div>
            <div className={s.tableItems}>
              {historyList?.map((el, index) => {
                const { changedate, desc, ip, user } = el

                return (
                  <SiteCareHistoryItem
                    key={index}
                    changedate={changedate?.$}
                    desc={desc?.$}
                    ip={ip?.$}
                    user={user?.$}
                  />
                )
              })}
            </div>
            <div className={s.total}>
              {t('Total')}: {historyList?.length}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
