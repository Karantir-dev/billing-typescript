import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {} from 'react-redux'
import { Button, IconButton, HintWrapper } from '../../..'
import * as routes from '../../../../routes'
import s from './SharedHostingFilter.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()

  const { selctedItem } = props

  // const [filterModal, setFilterModal] = useState(false)

  // const dispatch = useDispatch()

  // const resetFilterHandler = setValues => {
  //   const clearField = {
  //     id: '',
  //     domain: '',
  //     pricelist: '',
  //     period: '',
  //     status: '',
  //     service_status: '',
  //     opendate: '',
  //     expiredate: '',
  //     orderdatefrom: '',
  //     orderdateto: '',
  //     cost_from: '',
  //     cost_to: '',
  //     autoprolong: '',
  //   }
  //   setValues && setValues({ ...clearField })
  //   setCurrentPage(1)
  //   setFilterModal(false)
  //   dispatch(domainsOperations.getDomainsFilters({ ...clearField, sok: 'ok' }, true))
  // }

  // const setFilterHandler = values => {
  //   setCurrentPage(1)
  //   setFilterModal(false)
  //   dispatch(domainsOperations.getDomainsFilters({ ...values, sok: 'ok' }, true))
  // }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            // onClick={() => setFilterModal(true)}
            icon="filter"
            className={s.calendarBtn}
          />
          {/* {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile && (
                    <DomainFiltertsModal
                      filterModal={filterModal}
                      setFilterModal={setFilterModal}
                      filters={filters}
                      filtersList={filtersList}
                      resetFilterHandler={resetFilterHandler}
                      setFilterHandler={setFilterHandler}
                    />
                  )}
                </div>
              </Portal>
              {!mobile && (
                <DomainFiltertsModal
                  filterModal={filterModal}
                  setFilterModal={setFilterModal}
                  filters={filters}
                  filtersList={filtersList}
                  resetFilterHandler={resetFilterHandler}
                  setFilterHandler={setFilterHandler}
                />
              )}
            </div>
          )} */}
        </div>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="edit" />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('trusted_users.Change tariff', { ns: 'trusted_users' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="change-tariff" />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            onClick={() => null}
            icon="clock"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="refund" />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('instruction', { ns: 'vds' })}
        >
          <IconButton className={s.tools_icon} disabled={!selctedItem} icon="info" />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('go_to_panel', { ns: 'vds' })}
        >
          <IconButton className={s.tools_icon} disabled={!selctedItem} icon="exitSign" />
        </HintWrapper>
      </div>
      <Button
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('to_order', { ns: 'other' })}
        type="button"
        onClick={() => navigate(routes.SHARED_HOSTING_ORDER)}
      />
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  selctedTicket: null,
}
