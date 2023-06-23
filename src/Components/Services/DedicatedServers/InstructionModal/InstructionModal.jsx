import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '@redux'
import { Loader, Modal } from '@components'
import s from './InstructionModal.module.scss'

export default function InstructionModal({ elid, closeModal, isOpen }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('dedicated_servers')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(dedicOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen}  className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>{t('Activation of Dedicated server')}</span>
      </Modal.Header>
      <Modal.Body  className={s.modal__body}>
        <div dangerouslySetInnerHTML={{ __html: instruction?.$ }} />
      </Modal.Body>
    </Modal>
  )
}
