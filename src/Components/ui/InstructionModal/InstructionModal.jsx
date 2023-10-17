import { useEffect, useState } from 'react'
import { Loader, Modal } from '@components'
import s from './InstructionModal.module.scss'
import PropTypes from 'prop-types'

export default function InstructionModal({
  closeModal,
  isOpen,
  dispatchInstruction,
  title,
}) {
  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatchInstruction(setInstruction)
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal} isClickOutside>
      <Modal.Header>
        <span className={s.headerText}>{title}</span>
      </Modal.Header>
      <Modal.Body className={s.modal__body}>
        <div dangerouslySetInnerHTML={{ __html: instruction }} />
      </Modal.Body>
    </Modal>
  )
}

InstructionModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool,
  dispatchInstruction: PropTypes.func,
  title: PropTypes.string,
}
