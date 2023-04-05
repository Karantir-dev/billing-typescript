import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './DedicList.module.scss'
import DedicItem from '../DedicItem/DedicItem'
import DedicMobileItem from '../DedicMobileItem/DedicMobileItem'
import { CheckBox } from '../../..'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '../../../../Redux'

export default function DedicList({
  emptyFilter,
  servers,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  rights,
  setActiveServices,
  activeServices,
}) {
  const { t } = useTranslation(['vds', 'other', 'access_log', 'dedicated_servers'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()

  const handleEditSubmit = (elid, server_name) => {
    dispatch(
      dedicOperations.editDedicServerNoExtraPay(
        elid,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        server_name,
        null,
      ),
    )
  }

  if (servers) {
    if (servers.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (servers.length === 0 && servers) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/no_dedic_server.png')}
            alt="dedic"
            className={s.dedic_img}
          />

          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE A DEDICATED SERVER YET', { ns: 'dedicated_servers' })}
          </p>
          <div className={s.discount_wrapper}>
            <p className={s.discount_percent}>
              {t('DISCOUNT -10% ON DEDICATED SERVERS', { ns: 'other' })}
            </p>
            <p className={s.discount_desc}>
              {t('You can get a discount using a promo code', { ns: 'other' })}:
              <span className={s.promocode}>S-ZM-DED20</span>
            </p>
          </div>

          <p className={s.no_service_description}>
            {t('dedic no services description', { ns: 'dedicated_servers' })}
          </p>
        </div>
      )
    }
  }

  return (
    <>
      {widerThan1550 && servers?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            initialState={activeServices?.length === servers?.length}
            func={isChecked => {
              isChecked ? setActiveServices([]) : setActiveServices(servers)
            }}
          />

          <ul className={s.head_row}>
            <li className={s.table_head}>{t('server_name')}:</li>
            <li className={s.table_head}>Id:</li>
            <li className={s.table_head}>{t('domain_name')}:</li>
            <li className={s.table_head}>{t('ip_address')}:</li>
            <li className={s.table_head}>{t('ostempl')}:</li>
            <li className={s.table_head}>{t('tariff')}:</li>
            <li className={s.table_head}>{t('status')}:</li>
            <li className={s.table_head}>{t('created')}:</li>
            <li className={s.table_head}>{t('valid_until')}:</li>
            <li className={s.table_head}></li>
          </ul>
        </div>
      )}

      <ul className={s.list}>
        {servers?.map(el => {
          return widerThan1550 ? (
            <DedicItem
              key={el.id.$}
              server={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              setElidForRebootModal={() => setElidForRebootModal([el.id.$])}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              rights={rights}
              handleEditSubmit={handleEditSubmit}
            />
          ) : (
            <DedicMobileItem
              key={el.id.$}
              server={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              setElidForRebootModal={() => setElidForRebootModal([el.id.$])}
              setActiveServices={setActiveServices}
              activeServices={activeServices}
              rights={rights}
              handleEditSubmit={handleEditSubmit}
            />
          )
        })}
      </ul>
    </>
  )
}

DedicList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  emptyFilter: PropTypes.bool,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setElidForRebootModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
