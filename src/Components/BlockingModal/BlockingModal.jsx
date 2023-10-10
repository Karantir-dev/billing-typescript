import { Modal } from '@components'
import { selectors } from '@redux'
import { t } from 'i18next'
import { useSelector } from 'react-redux'

export default function BlockingModal() {
  const isOnline = useSelector(selectors.onlineStatus)

  return (
    <Modal isOpen={!isOnline}>
      <Modal.Body>{t('offline', { ns: 'other' })}</Modal.Body>
    </Modal>
  )
}
