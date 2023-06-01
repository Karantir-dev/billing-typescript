import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './FTPList.module.scss'
import FTPItem from '../FTPItem/FTPItem'
import FTPMobileItem from '../FTPMobileItem/FTPMobileItem'
import { CheckBox } from '../../..'

export default function FTPList({
  emptyFilter,
  storageList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  rights,
  setActiveServices,
  activeServices,
}) {
  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
    'ftp',
  ])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (storageList) {
    if (storageList.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (storageList.length === 0) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('@images/services/no_ftp.png')}
            alt="ftp"
            className={s.ftp_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE AN EXTERNAL FTP STORAGE YET', { ns: 'ftp' })}
          </p>
          <p className={s.no_service_description}>
            {t('no ftp services description', { ns: 'ftp' })}
          </p>
        </div>
      )
    }
  }

  const isAllActive = activeServices?.length === storageList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(storageList)
  }

  return (
    <>
      {widerThan1600 && storageList?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />
          <ul className={s.head_row}>
            <li className={s.table_head}>Id:</li>
            <li className={s.table_head}>{t('tariff')}:</li>
            <li className={s.table_head}>
              {t('datacenter', { ns: 'dedicated_servers' })}:
            </li>
            <li className={s.table_head}>{t('created')}:</li>
            <li className={s.table_head}>{t('valid_until')}:</li>
            <li className={s.table_head}>{t('status', { ns: 'other' })}:</li>
            <li className={s.table_head}>{t('Price', { ns: 'domains' })}:</li>
            <li className={s.table_head}></li>
          </ul>
        </div>
      )}

      <ul className={s.list}>
        {storageList?.map(el => {
          return widerThan1600 ? (
            <FTPItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              setActiveServices={setActiveServices}
              activeServices={activeServices}
              rights={rights}
            />
          ) : (
            <FTPMobileItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              setActiveServices={setActiveServices}
              activeServices={activeServices}
              rights={rights}
            />
          )
        })}
      </ul>
    </>
  )
}

FTPList.propTypes = {
  storageList: PropTypes.arrayOf(PropTypes.object),
  emptyFilter: PropTypes.bool,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
