import { Button, Modal, WarningMessage } from '@components'
import s from './Modals.module.scss'
import { useTranslation } from 'react-i18next'
import { getInstanceMainInfo } from '@utils'

export const ConfirmModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps'])
  const { displayName } = getInstanceMainInfo(item)

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p> {t(`confirm.title.${item.confirm_action}`)}</p>
      </Modal.Header>
      <Modal.Body>
        {item?.confirm_action === 'stop' && (
          <WarningMessage className={s.stopWarning} iconClassName={s.stopWarinng_icon}>
            {t(`rebuild_modal.warning.${item.confirm_action}`)}
          </WarningMessage>
        )}
        <p className={s.body__text}>
          {t(`confirm.text.${item.confirm_action}`, {
            name: displayName,
          })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size={'small'}
          onClick={() => onSubmit(item.confirm_action, item.id.$)}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
