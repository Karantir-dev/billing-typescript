import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './ForexMobileItem.module.scss'
import { CheckBox, ServerState, Options } from '@components'
import { useCreateTicketOption, isUnpaidOrder } from '@src/utils'

export default function ForexMobileItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForDeletionModal,
  setElidForInstructionModal,
  activeServices,
  setActiveServices,
  pageRights,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])

  const handleToolBtnClick = fn => {
    fn()
  }

  const deleteOption = isUnpaidOrder(server, unpaidItems)
  const createTicketOption = useCreateTicketOption(server.id.$)

  const isToolsBtnVisible =
    Object.keys(pageRights)?.filter(
      key => key !== 'ask' && key !== 'filter' && key !== 'new',
    ).length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== server?.id?.$))
      : setActiveServices([...activeServices, server])
  }

  const options = [
    deleteOption,
    {
      label: t('instruction'),
      icon: 'Info',
      disabled: server?.status?.$ === '1' || !pageRights?.instruction,
      onClick: () => handleToolBtnClick(setElidForInstructionModal),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled:
        server?.status?.$ === '1' || server?.status?.$ === '5' || !pageRights?.prolong,
      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled:
        !pageRights?.edit || server?.status?.$ === '1' || server?.status?.$ === '5',
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: !pageRights?.history || server?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
    createTicketOption,
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled: !server.id.$ || !pageRights?.delete || server?.status?.$ === '5',
      onClick: () => handleToolBtnClick(setElidForDeletionModal),
      isDelete: true,
    },
  ]

  return (
    <li className={s.item}>
      {isToolsBtnVisible && (
        <div className={s.tools_wrapper}>
          <div className={s.headerName_wrapper}>
            <CheckBox
              className={s.check_box}
              value={isActive}
              onClick={toggleIsActiveHandler}
            />
            <span className={s.headerName}>{server?.server_name?.$}</span>
          </div>
          <Options options={options} />
        </div>
      )}

      <span className={s.label}>ID:</span>
      <span className={s.value}>{server?.id?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
          .replace('domains', t('domains', { ns: 'dns' }))
          .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
      </span>
      <span className={s.label}>{t('datacenter', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{server?.datacentername?.$}</span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <ServerState className={s.value} server={server} />
      <span className={s.label}>{t('Price', { ns: 'domains' })}:</span>
      <span className={s.value}>
        {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
      </span>
    </li>
  )
}

ForexMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setElidForDeletionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  pageRights: PropTypes.object,
}
