import { Button, Modal } from '@components'
import s from './Modals.module.scss'

export const ShutDownModal = ({ item, closeModal, onSubmit }) => {
  const isStopped = item.item_status.$orig === '2_2_16'
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{isStopped ? 'Start instance' : 'Stop instance'}</p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.body__text}>
          {isStopped
            ? 'Do you really want to start the instance'
            : 'Are you sure you want to stop instance'}{' '}
          {item.id.$}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Yes"
          size={'small'}
          onClick={() => onSubmit(isStopped ? 'start' : 'stop')}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  )
}
