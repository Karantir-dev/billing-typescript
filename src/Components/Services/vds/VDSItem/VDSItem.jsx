import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBox, TooltipWrapper, ServerState, EditCell, Options } from '@components'
import PropTypes from 'prop-types'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import s from './VDSItem.module.scss'
import { useCreateTicketOption, isUnpaidOrder } from '@utils'

export default function VDSItem({
  server,
  rights,
  activeServices,
  setActiveServices,
  setIdForEditModal,
  setIdForDeleteModal,
  setIdForPassChange,
  setIdForReboot,
  setIdForProlong,
  setIdForHistory,
  setIdForInstruction,
  goToPanelFn,
  handleEditSubmit,
  isDedic,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [originName, setOriginName] = useState('')

  const deleteOption = isUnpaidOrder(server, unpaidItems)
  const createTicketOption = useCreateTicketOption(server.id.$)

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const handleToolBtnClick = fn => {
    fn()
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

  const editNameHandler = value => {
    handleEditSubmit(server?.id?.$, { server_name: value }, setOriginName)
    setOriginName(value)
  }

  const options = [
    deleteOption,
    {
      label: t('instruction'),
      icon: 'Info',
      disabled:
        (server?.status?.$ !== '3' && server?.status?.$ !== '2') || !rights?.instruction,
      onClick: () => handleToolBtnClick(setIdForInstruction),
    },
    {
      label: t('go_to_panel'),
      icon: 'ExitSign',
      disabled:
        server?.transition?.$ !== 'on' ||
        server?.status?.$ !== '2' ||
        !rights?.gotoserver,
      onClick: () => handleToolBtnClick(goToPanelFn),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled:
        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
        server?.status?.$ === '5' ||
        server?.item_status?.$?.trim() === 'Suspended by Administrator' ||
        !rights?.prolong ||
        server?.pricelist?.$?.toLowerCase()?.includes('ddos'),
      onClick: () => handleToolBtnClick(setIdForProlong),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: (server?.status?.$ !== '3' && server?.status?.$ !== '2') || !rights?.edit,
      onClick: () => handleToolBtnClick(setIdForEditModal),
    },
    {
      label: t('password_change'),
      icon: 'PassChange',
      disabled:
        server?.allow_changepassword?.$ !== 'on' ||
        !rights?.changepassword ||
        server?.ostempl?.$?.includes('Windows'),
      onClick: () => handleToolBtnClick(setIdForPassChange),
    },
    {
      label: t('reload'),
      icon: 'Reload',
      disabled: server?.show_reboot?.$ !== 'on' || !rights?.reboot,
      onClick: () => handleToolBtnClick(setIdForReboot),
    },
    {
      label: t('ip_addresses'),
      icon: 'IP',
      disabled:
        server?.status?.$ === '5' || server?.has_ip_pricelist?.$ !== 'on' || !rights?.ip,
      onClick: () =>
        navigate(route.VPS_IP, {
          state: { id: server?.id?.$ },
          replace: true,
        }),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled:
        (server?.status?.$ !== '3' && server?.status?.$ !== '2') || !rights?.history,
      onClick: () => handleToolBtnClick(setIdForHistory),
    },
    createTicketOption,
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        server?.status?.$ === '5' ||
        server?.scheduledclose?.$ === 'on' ||
        !rights?.delete,
      onClick: () => handleToolBtnClick(setIdForDeleteModal),
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

      <li
        className={cn(s.item, {
          [s.active_server]: isActive,
        })}
      >
        <span className={cn(s.value, { [s.dedic]: isDedic })}>
          <EditCell
            originName={originName}
            onSubmit={editNameHandler}
            placeholder={t(originName || t('server_placeholder', { ns: 'vds' }), {
              ns: 'vds',
            })}
            isShadow={true}
          />
        </span>
        <span className={cn(s.value, { [s.dedic]: isDedic })}>{server?.id?.$}</span>
        <span className={cn(s.value, { [s.dedic]: isDedic })}>
          {server?.domain?.$ ? (
            <TooltipWrapper
              disabled={server?.domain?.$.length < 15}
              content={server?.domain?.$}
              wrapperClassName={cn(s.hint)}
              id="server_name"
            >
              <span>{server?.domain?.$}</span>
            </TooltipWrapper>
          ) : null}
        </span>
        <span className={cn(s.value, { [s.dedic]: isDedic })}>{server?.ip?.$}</span>
        <span className={cn(s.value, { [s.dedic]: isDedic })}>{server?.ostempl?.$}</span>

        {isDedic ? (
          <>
            <span className={cn(s.value, { [s.dedic]: isDedic })}>
              {server?.pricelist?.$}
              <span className={s.price}>
                {server?.cost?.$?.replace('Month', t('short_month', { ns: 'other' }))}
              </span>
            </span>
            <span className={cn(s.value, { [s.dedic]: isDedic })}>
              {server?.datacentername?.$}
            </span>
            <ServerState
              className={cn(s.value, { [s.dedic]: isDedic })}
              server={server}
            />
          </>
        ) : (
          <span className={cn(s.value, { [s.dedic]: isDedic })}>
            {server?.datacentername?.$}
          </span>
        )}

        <span className={cn(s.value, { [s.dedic]: isDedic })}>
          {server?.createdate?.$}
        </span>
        <span className={cn(s.value, { [s.dedic]: isDedic })}>
          {server?.pricelist?.$?.toLowerCase()?.includes('ddos') ? (
            <div className={s.dailyCharge}>
              <span>{t('daily charges')}</span>
              <a
                target="_blank"
                href={`${process.env.REACT_APP_SITE_URL}/anti-ddos`}
                rel="noreferrer"
              >
                <div></div>
              </a>
            </div>
          ) : (
            server?.expiredate?.$
          )}
        </span>
        {isDedic ? null : (
          <>
            <ServerState
              className={cn(s.value, { [s.dedic]: isDedic })}
              server={server}
            />
            <span className={cn(s.value, { [s.dedic]: isDedic })}>
              {server?.pricelist?.$}
              <span className={s.price}>
                {server?.cost?.$?.replace('Month', t('short_month', { ns: 'other' }))}
              </span>
            </span>
          </>
        )}
        {isToolsBtnVisible && <Options options={options} />}
      </li>
    </div>
  )
}

VDSItem.propTypes = {
  server: PropTypes.object.isRequired,
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
}
