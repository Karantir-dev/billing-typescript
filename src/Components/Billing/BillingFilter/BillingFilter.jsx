import React from 'react'
// import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
// import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton } from '../..'
// import { supportOperations } from '../../../Redux'
import s from './BillingFilter.module.scss'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])
  // const dispatch = useDispatch()
  const params = useParams()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        </div>
        <IconButton onClick={() => null} icon="csv" className={s.archiveBtn} />
        {params?.path === 'payments' && (
          <IconButton onClick={() => null} icon="pdf" className={s.archiveBtn} />
        )}
      </div>
      {params?.path === 'payments' && (
        <Button
          className={s.newTicketBtn}
          isShadow
          size="medium"
          label={t('Create')}
          type="button"
          onClick={() => null}
        />
      )}
    </div>
  )
}

Component.propTypes = {}

Component.defaultProps = {}
