import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@components'
import s from './SiteCareDeleteModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other', 'vds'])

  const {
    name,
    closeModal,
    deleteSiteCareHandler,
    deleteIds,
    isOpen,
    isDeleteLater = false,
  } = props

  const deleteHandler = () => {
    deleteSiteCareHandler(deleteIds)
  }

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      simple
      className={s.modal}
      isClickOutside
    >
      <Modal.Header />
      <Modal.Body>
        <span className={s.headerText}>{t('Deleting a service')}</span>
        {isDeleteLater && <p className={s.warn}>{t('warn_message', { ns: 'vds' })}</p>}
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
          onClick={closeModal}
          label={t('Cancel', { ns: 'other' })}
          type="button"
        />
        <button onClick={() => deleteHandler()} type="button" className={s.clearFilters}>
          {t('delete', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
