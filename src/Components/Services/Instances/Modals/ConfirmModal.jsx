import { Button, Modal } from '@components'
import s from './Modals.module.scss'
import { useTranslation } from 'react-i18next'

export const ConfirmModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p> {t(`confirm.title.${item.confirm_action}`)}</p>
      </Modal.Header>
      <Modal.Body>
        <p className={s.body__text}>
          {t(`confirm.text.${item.confirm_action}`, {
            name: item.servername?.$ || item.name.$,
          })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Yes')}
          size={'small'}
          onClick={() => onSubmit(item.confirm_action, item.id.$)}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('No')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
