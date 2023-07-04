import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import FilterModal from './FilterModal'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useParams } from 'react-router-dom'
import { Button, IconButton, Portal, CreateTicketModal, HintWrapper } from '../..'
import { actions, supportOperations } from '@redux'
import s from './SupportFilter.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    selctedTicket,
    setCurrentPage,
    isFiltered,
    setIsFiltered,
    isFilterActive,
    p_cnt,
  } = props

  const [createTicketModal, setCreateTicketModal] = useState(false)
  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const dispatch = useDispatch()
  const params = useParams()

  useEffect(() => {
    resetFilterHandler()
  }, [])

  const filterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)

    values.p_cnt = p_cnt

    setIsFiltered && setIsFiltered(true)
    if (params?.path === 'requests') {
      dispatch(supportOperations.getTicketsFiltersHandler(values))
    } else if (params?.path === 'requests_archive') {
      dispatch(supportOperations.getTicketsArchiveFiltersHandler(values))
    }
  }

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
      message: '',
      name: '',
      abuse: 'null',
      tstatus: '',
      message_post: 'nodate',
      message_poststart: '',
      message_postend: '',
      p_cnt: p_cnt,
    }
    setIsFiltered && setIsFiltered(false)
    setFilterModal(true)
    setCurrentPage(1)
    setFilterModal(false)
    if (params?.path === 'requests') {
      dispatch(supportOperations.getTicketsFiltersHandler(clearField))
    } else if (params?.path === 'requests_archive') {
      dispatch(supportOperations.getTicketsArchiveFiltersHandler(clearField))
    }
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
            disabled={!isFilterActive}
          />
          {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile && (
                    <FilterModal
                      filterHandler={filterHandler}
                      resetFilterHandler={resetFilterHandler}
                      filterModal={filterModal}
                      setFilterModal={setFilterModal}
                    />
                  )}
                </div>
              </Portal>
              {!mobile && (
                <FilterModal
                  filterHandler={filterHandler}
                  resetFilterHandler={resetFilterHandler}
                  filterModal={filterModal}
                  setFilterModal={setFilterModal}
                />
              )}
            </div>
          )}
        </div>
        {params?.path === 'requests' && (
          <HintWrapper 
            wrapperClassName={s.archiveBtn}
            popupClassName={s.archivePopUp}
            label={t('To the archive')}
          >
            <IconButton
              dataTestid={'archiveBtn'}
              disabled={selctedTicket?.toarchive?.$ !== 'on'}
              onClick={() =>
                dispatch(supportOperations.archiveTicketsHandler(selctedTicket?.id?.$))
              }
              icon="archive"
            />
          </HintWrapper>
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
