import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { VDSmobileItem, VDSItem, CheckBox } from '../../..'
import PropTypes from 'prop-types'

import s from './VDSList.module.scss'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../../Redux'

export default function VDSList({
  servers,
  rights,
  setIdForEditModal,
  setIdForDeleteModal,
  setIdForPassChange,
  setIdForReboot,
  setIdForProlong,
  setIdForInstruction,
  setIdForHistory,
  goToPanelFn,
  activeServices,
  setActiveServices,
  getVDSHandler,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()

  const handleEditSubmit = (elid, values) => {
    const mutatedValues = { ...values, clicked_button: 'ok' }
    dispatch(
      vdsOperations.editVDS(elid, mutatedValues, null, null, null, null, getVDSHandler),
    )
  }

  return (
    <>
      {widerThan1600 && servers?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            initialState={activeServices.length === servers.length}
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
            <li className={s.table_head}>{t('data_center')}:</li>
            <li className={s.table_head}>{t('created')}:</li>
            <li className={s.table_head}>{t('valid_until')}:</li>
            <li className={s.table_head}>{t('status')}:</li>
            <li className={s.table_head}>{t('tariff')}:</li>
            <li className={s.tenth_element}></li>
          </ul>
        </div>
      )}

      <ul className={s.list}>
        {servers?.map(el => {
          if (
            el?.pricelist?.$?.includes('VDS/VPS') &&
            el?.pricelist?.$?.includes('Pro')
          ) {
            el.pricelist.$ = 'VDS/VPS «Pro»'
          } else if (
            el?.pricelist?.$?.includes('VDS/VPS') &&
            el?.pricelist?.$?.includes('2xPlatinum')
          ) {
            el.pricelist.$ = 'VDS/VPS «2xPlatinum»'
          }
          return widerThan1600 ? (
            <VDSItem
              key={el.id.$}
              server={el}
              rights={rights}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              setIdForDeleteModal={() => setIdForDeleteModal([el.id.$])}
              setIdForEditModal={() => setIdForEditModal(el.id.$)}
              setIdForPassChange={() => setIdForPassChange([el.id.$])}
              setIdForReboot={() => setIdForReboot([el.id.$])}
              setIdForProlong={() => setIdForProlong([el.id.$])}
              setIdForInstruction={() => setIdForInstruction(el.id.$)}
              setIdForHistory={() => setIdForHistory(el.id.$)}
              goToPanelFn={() => goToPanelFn(el.id.$)}
              handleEditSubmit={handleEditSubmit}
            />
          ) : (
            <VDSmobileItem
              key={el.id.$}
              server={el}
              rights={rights}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              setIdForDeleteModal={() => setIdForDeleteModal([el.id.$])}
              setIdForEditModal={() => setIdForEditModal(el.id.$)}
              setIdForPassChange={() => setIdForPassChange([el.id.$])}
              setIdForReboot={() => setIdForReboot([el.id.$])}
              setIdForProlong={() => setIdForProlong([el.id.$])}
              setIdForInstruction={() => setIdForInstruction(el.id.$)}
              setIdForHistory={() => setIdForHistory(el.id.$)}
              goToPanelFn={() => goToPanelFn(el.id.$)}
              handleEditSubmit={handleEditSubmit}
            />
          )
        })}
      </ul>
    </>
  )
}

VDSList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object).isRequired,
  rights: PropTypes.object.isRequired,
  setIdForEditModal: PropTypes.func.isRequired,
  setIdForDeleteModal: PropTypes.func.isRequired,
  setIdForPassChange: PropTypes.func.isRequired,
  setIdForReboot: PropTypes.func.isRequired,
  setIdForProlong: PropTypes.func.isRequired,
  setIdForInstruction: PropTypes.func.isRequired,
  setIdForHistory: PropTypes.func.isRequired,
  goToPanelFn: PropTypes.func.isRequired,
  activeServices: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveServices: PropTypes.func.isRequired,
  getVDSHandler: PropTypes.func.isRequired,
}
