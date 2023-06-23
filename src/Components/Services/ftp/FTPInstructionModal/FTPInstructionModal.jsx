import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ftpOperations } from '@redux'
import { Modal } from '@components'
import Loader from '../../../ui/Loader/Loader'

import s from './FTPInstructionModal.module.scss'

export default function FTPInstructionModal({ elid, closeModal, isOpen }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('other')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(ftpOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>{t('FTP storage activation')}</span>
      </Modal.Header>
      <Modal.Body className={s.modal__body}>
        <div dangerouslySetInnerHTML={{ __html: instruction?.$ }} />
      </Modal.Body>
    </Modal>
  )
}
