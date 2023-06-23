import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { dnsOperations } from '@redux'
import { Modal } from '@components'
import Loader from '../../../ui/Loader/Loader'

import s from './ForexInstructionModal.module.scss'

export default function ForexInstructionModal({ elid, closeModal, isOpen }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('other')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(dnsOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <span className={s.headerText}>{t('Forex server activation')}</span>
      </Modal.Header>
      <Modal.Body className={s.modal__body}>
        <div
          dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        />
      </Modal.Body>
    </Modal>
  )
}
