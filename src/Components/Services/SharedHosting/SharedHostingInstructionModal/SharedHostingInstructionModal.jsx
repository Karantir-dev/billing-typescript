import { useTranslation } from 'react-i18next'
import s from './SharedHostingInstructionModal.module.scss'
import { Modal } from '@components'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeModal, instructionData, isOpen } = props

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>
          {t('Instruction')} {name}
        </span>
      </Modal.Header>
      <Modal.Body className={s.modal__body}>
        <div dangerouslySetInnerHTML={{ __html: instructionData }} />
      </Modal.Body>
    </Modal>
  )
}
