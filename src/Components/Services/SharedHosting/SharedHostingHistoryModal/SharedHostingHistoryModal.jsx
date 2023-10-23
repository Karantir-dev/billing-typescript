import SharedHostingHistoryItem from './SharedHostingHistoryItem'
import { useTranslation } from 'react-i18next'
import { Pagination, Modal } from '@components'
import cn from 'classnames'
import s from './SharedHostingHistoryModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const {
    name,
    historyList,
    closeModal,
    historyCurrentPage,
    historyItemCount,
    setHistoryCurrentPage,
    isOpen,
  } = props

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className={s.modal} isClickOutside>
      <Modal.Header>
        <span className={s.headerText}>
          {t('Service change history')} - {name}
        </span>
      </Modal.Header>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Date of change')}:</span>
        <span className={cn(s.title_text, s.second_item)}>{t('Change')}:</span>
        <span className={cn(s.title_text, s.third_item)}>{t('Username')}:</span>
        <span className={cn(s.title_text, s.fourth_item)}>{t('IP address')}:</span>
      </div>
      <Modal.Body>
        <div className={s.tableItems}>
          {historyList?.map((el, index) => {
            const { changedate, desc, ip, user } = el

            return (
              <SharedHostingHistoryItem
                key={index}
                changedate={changedate?.$}
                desc={desc?.$}
                ip={ip?.$}
                user={user?.$}
              />
            )
          })}
        </div>
      </Modal.Body>
      {historyItemCount > 10 && (
        <Modal.Footer>
          <Pagination
            currentPage={historyCurrentPage}
            totalCount={Number(historyItemCount)}
            pageSize={10}
            onPageChange={page => setHistoryCurrentPage(page)}
          />
        </Modal.Footer>
      )}
    </Modal>
  )
}
