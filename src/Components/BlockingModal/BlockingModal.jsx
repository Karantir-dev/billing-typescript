import { Icon, Modal } from '@components'
import { selectors } from '@redux'
import { t } from 'i18next'
import { useSelector } from 'react-redux'
import s from './BlockingModal.module.scss'

export default function BlockingModal() {
  const isOnline = useSelector(selectors.onlineStatus)

  return (
    <Modal className={s.modal} isOpen={!isOnline}>
      <Modal.Body className={s.modal_body}>
        <Icon className={s.triangle} name="ErrorPay" />
        <p className={s.title}>{t('offline_title', { ns: 'other' })}</p>
        <p className={s.text}>{t('offline', { ns: 'other' })}</p>
      </Modal.Body>
    </Modal>
  )
}
