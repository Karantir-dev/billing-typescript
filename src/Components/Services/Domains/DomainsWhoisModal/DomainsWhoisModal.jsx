import { useTranslation } from 'react-i18next'
import { Modal } from '@components'
import s from './DomainsWhoisModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { closeModal, whoisData, isOpen } = props

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className={s.modal} isClickOutside>
      <Modal.Header>
        <span className={s.headerText}>{t('Domain Information')}</span>
      </Modal.Header>
      <Modal.Body className={s.modal__body}>
        <div className={s.whoisBlock}>{whoisData}</div>
      </Modal.Body>
    </Modal>
  )
}
