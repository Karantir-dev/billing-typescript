import { Modal } from '@components'
import { selectors } from '@redux'
import { useSelector } from 'react-redux'

export default function BlockingModal() {
  const isShown = useSelector(selectors.getBlockingModalStatus)

  return (
    <Modal isOpen={isShown}>
      <Modal.Body>wqweqw</Modal.Body>
    </Modal>
  )
}
