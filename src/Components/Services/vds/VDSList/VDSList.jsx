import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { VDSmobileItem, VDSItem } from '../../..'
import PropTypes from 'prop-types'

import s from './VDSList.module.scss'

export default function VDSList({
  servers,
  rights,
  setElidForEditModal,
  setActiveServer,
  activeServerID,
  setIdForDeleteModal,
  setIdForPassChange,
  setIdForReboot,
  setIdForProlong,
  setIdForInstruction,
  setIdForHistory,
  goToPanel,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  return (
    <>
      {widerThan1600 && servers?.length > 0 && (
        <ul className={s.head_row}>
          <li className={s.table_head}>Id:</li>
          <li className={s.table_head}>{t('domain_name')}:</li>
          <li className={s.table_head}>{t('ip_address')}:</li>
          <li className={s.table_head}>{t('ostempl')}:</li>
          <li className={s.table_head}>{t('tariff')}:</li>
          <li className={s.table_head}>{t('data_center')}:</li>
          <li className={s.table_head}>{t('status')}:</li>
          <li className={s.table_head}>{t('created')}:</li>
          <li className={s.table_head}>{t('valid_until')}:</li>
        </ul>
      )}

      <ul className={s.list}>
        {servers?.map(el => {
          return widerThan1600 ? (
            <VDSItem
              key={el.id.$}
              server={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <VDSmobileItem
              key={el.id.$}
              server={el}
              rights={rights}
              setIdForDeleteModal={() => setIdForDeleteModal(el.id.$)}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setIdForPassChange={() => setIdForPassChange(el.id.$)}
              setIdForReboot={() => setIdForReboot(el.id.$)}
              setIdForProlong={() => setIdForProlong(el.id.$)}
              setIdForInstruction={() => setIdForInstruction(el.id.$)}
              setIdForHistory={() => setIdForHistory(el.id.$)}
              goToPanel={() => goToPanel(el.id.$)}
            />
          )
        })}
      </ul>
    </>
  )
}

VDSList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}