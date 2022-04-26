import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FilterModal from './FilterModal'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton, Portal, CreateTicketModal } from '../..'
import { supportOperations } from '../../../Redux'
import s from './SupportFilter.module.scss'

export default function Component({ selctedTicket, setCurrentPage }) {
  const { t } = useTranslation(['support', 'other'])
  const [createTicketModal, setCreateTicketModal] = useState(false)
  const [filterModal, setFilterModal] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={s.calendarBtn}
          />
          {filterModal && (
            <>
              <Portal>
                <div className={s.bg} />
              </Portal>
              <FilterModal
                setCurrentPage={setCurrentPage}
                filterModal={filterModal}
                setFilterModal={setFilterModal}
              />
            </>
          )}
        </div>
        {params?.path === 'requests' && (
          <IconButton
            dataTestid={'archiveBtn'}
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
          dataTestid={'new_ticket_btn'}
          className={s.newTicketBtn}
          isShadow
          size="medium"
          label={t('new ticket')}
          type="button"
          onClick={() => setCreateTicketModal(true)}
        />
      )}
      {createTicketModal && (
        <Portal>
          <CreateTicketModal setCreateTicketModal={setCreateTicketModal} />
        </Portal>
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
