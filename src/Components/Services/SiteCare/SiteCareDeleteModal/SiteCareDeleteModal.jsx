import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Button } from '../../..'
import s from './SiteCareDeleteModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const { name, closeDeleteModalHandler, deleteSiteCareHandler } = props

  const deleteHandler = values => {
    const data = { ...values, sok: 'ok' }
    deleteSiteCareHandler(data)
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <div className={s.headerTitleBlock}>
          <span className={s.headerText}>{t('Deleting a service')}</span>
        </div>
        <Cross onClick={closeDeleteModalHandler} className={s.crossIcon} />
      </div>
      <div className={s.deleteInfo}>
        {t('Are you sure you want to delete the service "{{name}}"?', { name: name })}
      </div>
      <div className={s.btnBlock}>
        <Button
          className={s.searchBtn}
          isShadow
          size="medium"
          onClick={deleteHandler}
          label={t('delete', { ns: 'other' })}
          type="button"
        />
        <button
          onClick={closeDeleteModalHandler}
          type="button"
          className={s.clearFilters}
        >
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </div>
  )
}