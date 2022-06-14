import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DomainFiltertsModal from '../DomainFiltertsModal/DomainFiltertsModal'
import { domainsOperations, domainsSelectors } from '../../../../Redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  IconButton,
  HintWrapper,
  DomainsHistoryModal,
  DomainsWhoisModal,
  DomainsNSModal,
  Portal,
} from '../../..'
import * as routes from '../../../../routes'
import s from './DomainFilters.module.scss'

export default function Component(props) {
  const { t, i18n } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const { selctedItem, setCurrentPage } = props

  const filters = useSelector(domainsSelectors.getDomainsFilters)
  const filtersList = useSelector(domainsSelectors.getDomainsFiltersList)

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])

  const [whoisModal, setWhoisModal] = useState(false)
  const [whoisData, setWhoisData] = useState(null)

  const [NSModal, setNSModal] = useState(false)
  const [NSData, setNSData] = useState(null)

  const [filterModal, setFilterModal] = useState(false)

  const dispatch = useDispatch()

  const renewDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
    }
    dispatch(domainsOperations.renewService(data))
  }

  const deleteDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
    }
    dispatch(domainsOperations.deleteDomain(data))
  }

  const historyDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(domainsOperations.getHistoryDomain(data, setHistoryModal, setHistoryList))
  }

  const closeHistoryModalHandler = () => {
    setHistoryList([])
    setHistoryModal(false)
  }

  const whoisDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(domainsOperations.getWhoisDomain(data, setWhoisModal, setWhoisData))
  }

  const closeWhoisModalHandler = () => {
    setWhoisData(null)
    setWhoisModal(false)
  }

  const NSDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
    }
    dispatch(domainsOperations.editDomainNS(data, setNSModal, setNSData))
  }

  const closeNSModalHandler = () => {
    setNSData(null)
    setNSModal(false)
  }

  const NSEditDomainHandler = values => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
    }

    if (values) {
      data = { ...data, ...values }
    }

    dispatch(domainsOperations.editDomainNS(data, setNSModal, setNSData))
  }

  const resetFilterHandler = setValues => {
    const clearField = {
      id: '',
      domain: '',
      pricelist: '',
      period: '',
      status: '',
      service_status: '',
      opendate: '',
      expiredate: '',
      orderdatefrom: '',
      orderdateto: '',
      cost_from: '',
      cost_to: '',
      autoprolong: '',
    }
    setValues && setValues({ ...clearField })
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(domainsOperations.getDomainsFilters({ ...clearField, sok: 'ok' }, true))
  }

  const setFilterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(domainsOperations.getDomainsFilters({ ...values, sok: 'ok' }, true))
  }

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
          )}
        </div>
        <HintWrapper wrapperClassName={s.archiveBtn} label={t('Transfer')}>
          <IconButton
            onClick={() => navigate(routes.DOMAINS_TRANSFER_ORDERS)}
            icon="transfer"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="edit" />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('delete', { ns: 'other' })}>
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '5_transfer'}
            onClick={deleteDomainHandler}
            icon="delete"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            onClick={renewDomainHandler}
            icon="clock"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem}
            onClick={historyDomainHandler}
            icon="refund"
          />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('Getting information about a domain using the whois protocol')}
        >
          <IconButton disabled={!selctedItem} onClick={whoisDomainHandler} icon="whois" />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('View/change the list of nameservers')}
        >
          <IconButton
            disabled={!selctedItem}
            onClick={NSDomainHandler}
            icon="server-cloud"
          />
        </HintWrapper>
      </div>
      {historyModal && historyList?.length > 0 && (
        <DomainsHistoryModal
          historyList={historyList}
          name={selctedItem?.name?.$}
          closeHistoryModalHandler={closeHistoryModalHandler}
        />
      )}
      {whoisModal && whoisData && (
        <DomainsWhoisModal
          whoisData={whoisData}
          name={selctedItem?.name?.$}
          closeWhoisModalHandler={closeWhoisModalHandler}
        />
      )}
      {NSModal && NSData && (
        <DomainsNSModal
          name={selctedItem?.name?.$}
          closeNSModalHandler={closeNSModalHandler}
          NSData={NSData}
          NSEditDomainHandler={NSEditDomainHandler}
        />
      )}
      <Button
        dataTestid={'new_ticket_btn'}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('New domain')}
        type="button"
        onClick={() => navigate(routes.DOMAINS_ORDERS)}
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
