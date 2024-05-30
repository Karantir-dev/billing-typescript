import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import s from './DedicMobileItem.module.scss'
import { CheckBox, EditCell, ServerState, Options, TooltipWrapper } from '@components'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { dedicOperations } from '@redux'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { useCreateTicketOption, isDisabledDedicTariff, isUnpaidOrder } from '@utils'

export default function DedicMobileItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  rights,
  setActiveServices,
  activeServices,
  handleEditSubmit,
  setIdForDeleteModal,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [originName, setOriginName] = useState('')

  const deleteOption = isUnpaidOrder(server, unpaidItems)
  const createTicketOption = useCreateTicketOption(server.id.$)

  const handleToolBtnClick = fn => {
    fn()
  }

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const editNameHandler = value => {
    handleEditSubmit(server?.id?.$, value)
    setOriginName(value)
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

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
      disabled: server?.status?.$ === '1' || !rights?.instruction,
      onClick: () => handleToolBtnClick(setElidForInstructionModal),
    },
    {
      label: t('go_to_panel'),
      icon: 'ExitSign',
      disabled:
        server.transition?.$ !== 'on' || server?.status?.$ !== '2' || !rights?.gotoserver,
      onClick: () => dispatch(dedicOperations.goToPanel(server.id.$)),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled:
        server?.status?.$ === '1' ||
        server?.status?.$ === '5' ||
        !rights?.prolong ||
        isDisabledDedicTariff(server?.name?.$),

      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: (server?.status?.$ !== '3' && server?.status?.$ !== '2') || !rights?.edit,
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('reload'),
      icon: 'Reload',
      disabled: server.show_reboot?.$ !== 'on' || !rights?.reboot,
      onClick: () => handleToolBtnClick(setElidForRebootModal),
    },
    {
      label: t('ip_addresses'),
      icon: 'IP',
      disabled:
        server.has_ip_pricelist?.$ !== 'on' || server?.status?.$ === '5' || !rights?.ip,
      onClick: () =>
        navigate(route.DEDICATED_SERVERS_IP, {
          state: { plid: server?.id?.$, isIpAllowedRender: rights?.ip },
          replace: true,
        }),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: server?.status?.$ === '1' || !rights?.history,
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
    createTicketOption,
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        server?.status?.$ === '5' ||
        server?.scheduledclose?.$ === 'on' ||
        !rights?.delete,
      onClick: () => setIdForDeleteModal([server.id.$]),
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

      <span className={s.label}>{t('server_name')}:</span>
      <span className={cn(s.value, s.value_edit, { [s.active]: isActive })}>
        <EditCell
          originName={originName}
          onSubmit={editNameHandler}
          placeholder={t(originName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          className={s.edit_cell}
        />
      </span>

      <span className={s.label}>Id:</span>
      <span className={s.value}>{server?.id?.$}</span>
      <span className={s.label}>{t('domain_name')}:</span>
      <TooltipWrapper
        disabled={server?.domain?.$.length < 15}
        content={server?.domain?.$}
        wrapperClassName={cn(s.hint)}
        anchor="mob_server_name"
      >
        <span className={cn(s.value, s.hide_lont_text)}>{server?.domain?.$}</span>
      </TooltipWrapper>
      <span className={s.label}>{t('ip_address')}:</span>
      <span className={s.value}>{server?.ip?.$}</span>
      <span className={s.label}>{t('ostempl')}:</span>
      <span className={s.value}>{server?.ostempl?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$}
        <span className={s.price}>
          {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>
      </span>

      <span className={s.label}>{t('status')}:</span>
      <ServerState className={s.value} server={server} />
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>
    </li>
  )
}

DedicMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setElidForRebootModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
  handleEditSubmit: PropTypes.func,
}
