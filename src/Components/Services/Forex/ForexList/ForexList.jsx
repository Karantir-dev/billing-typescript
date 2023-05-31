import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './ForexList.module.scss'
import ForexItem from '../ForexItem/ForexItem'
import ForexMobileItem from '../ForexMobileItem/ForexMobileItem'
import { CheckBox } from '../../..'

export default function ForexList({
  emptyFilter,
  forexList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForDeletionModal,
  setElidForInstructionModal,
  activeServices,
  setActiveServices,
  pageRights,
}) {
  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
  ])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (forexList) {
    if (forexList.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (forexList.length === 0 && forexList) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/forexbox.webp')}
            alt="forex"
            className={s.forex_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE A FOREX SERVER YET', { ns: 'other' })}
          </p>
          <p className={s.no_service_description}>
            {t('no services forex description', { ns: 'other' })}
          </p>
        </div>
      )
    }
  }

  const isAllActive = activeServices?.length === forexList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(forexList)
  }

  return (
    <>
      {widerThan1600 && forexList?.length > 0 && (
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

      <div className={s.list}>
        {forexList?.map(el => {
          return widerThan1600 ? (
            <ForexItem
              key={el.id.$}
              server={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForDeletionModal={() => setElidForDeletionModal([el.id.$])}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              pageRights={pageRights}
            />
          ) : (
            <ForexMobileItem
              key={el.id.$}
              server={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForDeletionModal={() => setElidForDeletionModal([el.id.$])}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              pageRights={pageRights}
            />
          )
        })}
      </div>
    </>
  )
}

ForexList.propTypes = {
  forexList: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  emptyFilter: PropTypes.bool,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setElidForDeletionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  pageRights: PropTypes.object,
}
