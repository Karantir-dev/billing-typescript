import { Button, Modal } from '@components'
import s from './Modals.module.scss'
import { useTranslation } from 'react-i18next'

export const ConfirmModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p> {t(`confirm.${item.confirm_action}.title`)}</p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.body__text}>
          {t(`confirm.${item.confirm_action}.text`)} {item.id.$}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Yes"
          size={'small'}
          onClick={() => onSubmit(item.confirm_action, item.id.$)}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  )
}
