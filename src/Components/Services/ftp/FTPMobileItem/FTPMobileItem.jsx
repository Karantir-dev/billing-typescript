import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import s from './FTPMobileItem.module.scss'
import { CheckBox, ServerState, Options } from '@components'
import { dedicOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { useCreateTicketOption, isUnpaidOrder } from '@utils'

export default function FTPMobileItem({
  storage,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  activeServices,
  setActiveServices,
  rights,
  setIdForDeleteModal,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const dispatch = useDispatch()

  const handleToolBtnClick = fn => {
    fn()
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === storage?.id?.$)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== storage?.id?.$))
      : setActiveServices([...activeServices, storage])
  }

  const deleteOption = isUnpaidOrder(storage, unpaidItems)
  const createTicketOption = useCreateTicketOption(storage.id.$)

  const options = [
    deleteOption,
    {
      label: t('instruction'),
      icon: 'Info',
      disabled: storage?.status?.$ === '1' || !rights?.instruction,
      onClick: () => handleToolBtnClick(setElidForInstructionModal),
    },
    {
      label: t('go_to_panel'),
      icon: 'ExitSign',
      disabled:
        storage.transition?.$ !== 'on' ||
        !rights?.gotoserver ||
        storage?.status?.$ !== '2',
      onClick: () => dispatch(dedicOperations.goToPanel(storage.id.$)),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled:
        storage?.status?.$ === '1' || storage?.status?.$ === '5' || !rights?.prolong,
      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !rights?.edit || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: !rights?.history || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
    createTicketOption,
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        storage?.status?.$ === '5' ||
        storage?.scheduledclose?.$ === 'on' ||
        !rights?.delete,
      onClick: () => setIdForDeleteModal([storage.id.$]),
      isDelete: true,
    },
  ]

  return (
    <li className={s.item}>
      {isToolsBtnVisible && (
        <div className={s.tools_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isActive}
            onClick={toggleIsActiveHandler}
          />

          <Options options={options} />
        </div>
      )}

      <span className={s.label}>Id:</span>
      <span className={s.value}>{storage?.id?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>{storage?.pricelist?.$}</span>
      <span className={s.label}>{t('datacenter', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{storage?.datacentername?.$}</span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{storage?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{storage?.expiredate?.$}</span>

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <ServerState className={s.value} server={storage} />
      <span className={s.label}>{t('Price', { ns: 'domains' })}:</span>
      <span className={s.value}>
        {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
      </span>
    </li>
  )
}

FTPMobileItem.propTypes = {
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
