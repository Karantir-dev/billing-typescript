import { Button, Modal } from '@components'
import s from './Modals.module.scss'

export const ShutDownModal = ({ stopInstanceModal, setStopInstanceModal }) => {
  return (
    <Modal
      isOpen={!!stopInstanceModal}
      closeModal={() => setStopInstanceModal(false)}
      isClickOutside
    >
      <Modal.Header>
        <p>Stop instance </p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.body__text}>
          Are you sure you want to stop instance “almalinux-NU9Osm6d”?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Yes"
          size={'small'}
          onClick={() => {
            setStopInstanceModal(false)
          }}
          isShadow
        />
        <button type="button" onClick={() => setStopInstanceModal(false)}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  )
}
