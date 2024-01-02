import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import s from './ForexItem.module.scss'
import { CheckBox, ServerState, Options } from '@components'
import { isUnpaidOrder } from '@utils'

export default function ForexItem({
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

  const handleToolBtnClick = fn => {
    fn()
  }
  const deleteOption = isUnpaidOrder(server, unpaidItems)

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
      disabled: server?.status?.$ === '1' || !pageRights?.prolong,
      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !pageRights?.edit || server?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: !pageRights?.history || server?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled: !server.id.$ || !pageRights?.delete || server?.status?.$ === '5',
      onClick: () => handleToolBtnClick(setElidForDeletionModal),
      isDelete: true,
    },
  ]

  return (
    <div className={s.item_wrapper}>
      <CheckBox
        className={s.check_box}
        value={isActive}
        onClick={toggleIsActiveHandler}
      />

      <div
        className={cn(s.item, {
          [s.active_server]: isActive,
        })}
      >
        <span className={s.value}>{server?.id?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
            .replace('domains', t('domains', { ns: 'dns' }))
            .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
        </span>
        <span className={s.value}>{server?.datacentername?.$}</span>
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>
        <ServerState className={s.value} server={server} />

        <span className={s.value}>
          {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>

        {isToolsBtnVisible && <Options options={options} />}
      </div>
    </div>
  )
}

ForexItem.propTypes = {
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
