import { Button, Modal } from '@components'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'

export const DeleteModal = ({ item, closeModal, onSubmit, type = 'image' }) => {
  const { t } = useTranslation(['cloud_vps', 'other'])

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>{t(`delete_${type}`)}</Modal.Header>
      <Modal.Body>
        <p>
          {t(`delete_${type}_text`, {
            name: `#${item[item.idKey].$} ${item.image_name?.$ ?? item.name?.$}`,
          })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size="small"
          type="submit"
          form={'delete'}
          onClick={onSubmit}
          isShadow
        />
        <button type="button" onClick={closeModal} className={s.cancel_btn}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
