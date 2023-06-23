import { useTranslation } from 'react-i18next'
import { Button, Modal } from '../../..'
import s from './SiteCareDeleteModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const { name, closeModal, deleteSiteCareHandler, deleteIds, isOpen } = props

  const deleteHandler = () => {
    deleteSiteCareHandler(deleteIds)
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} simple className={s.modal}>
      <Modal.Header />
      <Modal.Body>
        <span className={s.headerText}>{t('Deleting a service')}</span>

        <div className={s.deleteInfo}>
          {name?.length > 0
            ? t('Are you sure you want to delete the service "{{name}}"?', {
                name: name,
              })
            : t('Are you sure you want to delete the service?', { ns: 'other' })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={s.searchBtn}
          isShadow
          size="medium"
          onClick={() => deleteHandler()}
          label={t('delete', { ns: 'other' })}
          type="button"
        />
        <button onClick={closeModal} type="button" className={s.clearFilters}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
