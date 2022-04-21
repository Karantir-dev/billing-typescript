import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton } from '../..'
import { supportOperations } from '../../../Redux'
import s from './SupportFilter.module.scss'

export default function Component({ selctedTicket }) {
  const { t } = useTranslation(['support', 'other'])
  const dispatch = useDispatch()
  const params = useParams()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        {params?.path === 'requests' && (
          <IconButton
            disabled={selctedTicket?.toarchive?.$ !== 'on'}
            onClick={() =>
              dispatch(supportOperations.archiveTicketsHandler(selctedTicket?.id?.$))
            }
            icon="archive"
            className={s.archiveBtn}
          />
        )}
      </div>
      {params?.path === 'requests' && (
        <Button
          className={s.newTicketBtn}
          isShadow
          size="medium"
          label={t('new ticket')}
          type="button"
        />
      )}
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  selctedTicket: null,
}
