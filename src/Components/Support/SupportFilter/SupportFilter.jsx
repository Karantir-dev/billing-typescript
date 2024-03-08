import { useState, useEffect } from 'react'
import cn from 'classnames'
import FilterModal from './FilterModal'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useParams } from 'react-router-dom'
import { Button, IconButton, Portal, CreateTicketModal } from '@components'
import { actions, supportOperations } from '@redux'
import s from './SupportFilter.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    setCurrentPage,
    isFiltered,
    setIsFiltered,
    isFilterActive,
    p_cnt,
    signal,
    setIsLoading,
  } = props

  const [createTicketModal, setCreateTicketModal] = useState(false)
  const [filterModal, setFilterModal] = useState(false)
  const location = useLocation()

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

    if (location.state?.openModal) {
      setCreateTicketModal(true)
    }
  }, [])

  const filterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)

    values.p_cnt = p_cnt

    setIsFiltered && setIsFiltered(true)
    if (params?.path === 'requests') {
      dispatch(supportOperations.getTicketsFiltersHandler(values, signal, setIsLoading))
    } else if (params?.path === 'requests_archive') {
      dispatch(
        supportOperations.getTicketsArchiveFiltersHandler(values, signal, setIsLoading),
      )
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
      dispatch(
        supportOperations.getTicketsFiltersHandler(clearField, signal, setIsLoading),
      )
    } else if (params?.path === 'requests_archive') {
      dispatch(
        supportOperations.getTicketsArchiveFiltersHandler(
          clearField,
          signal,
          setIsLoading,
        ),
      )
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
        <CreateTicketModal
          setCreateTicketModal={setCreateTicketModal}
          relatedService={location.state?.id}
        />
      )}
    </div>
  )
}
