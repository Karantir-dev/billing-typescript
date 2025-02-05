import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { VDSmobileItem, VDSItem, CheckBox } from '@components'
import PropTypes from 'prop-types'

import s from './VDSList.module.scss'
import { useDispatch } from 'react-redux'
import { billingOperations, vdsOperations } from '@redux'
import cn from 'classnames'
import { useEffect, useState } from 'react'

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
  isDedic,
  signal,
  setIsLoading,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()

  const [unpaidItems, setUnpaidItems] = useState([])

  useEffect(() => {
    dispatch(billingOperations.getUnpaidOrders(setUnpaidItems, signal))
  }, [])

  const handleEditSubmit = (elid, values) => {
    const mutatedValues = { ...values, clicked_button: 'ok' }
    dispatch(
      vdsOperations.editVDS({
        elid,
        values: mutatedValues,
        getVDSHandler,
        signal,
        setIsLoading,
      }),
    )
  }

  const isAllActive = activeServices.length === servers.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(servers)
  }

  return (
    <>
      {widerThan1600 && servers?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />

          <ul className={s.head_row}>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
              {t('server_name')}:
            </li>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>Id:</li>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
              {t('domain_name')}:
            </li>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
              {t('ip_address')}:
            </li>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>{t('ostempl')}:</li>
            {isDedic ? (
              <>
                <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                  {t('tariff')}:
                </li>
                <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                  {t('data_center')}:
                </li>
                <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                  {t('status')}:
                </li>
              </>
            ) : (
              <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                {t('data_center')}:
              </li>
            )}
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>{t('created')}:</li>
            <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
              {t('valid_until')}:
            </li>
            {isDedic ? null : (
              <>
                <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                  {t('status')}:
                </li>
                <li className={cn(s.table_head, { [s.dedic]: isDedic })}>
                  {t('tariff')}:
                </li>
              </>
            )}
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
              isDedic={isDedic}
              unpaidItems={unpaidItems}
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
              isDedic={isDedic}
              unpaidItems={unpaidItems}
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
