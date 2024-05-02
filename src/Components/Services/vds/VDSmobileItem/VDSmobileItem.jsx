import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { CheckBox, ServerState, EditCell, Options } from '@components'
import PropTypes from 'prop-types'
import cn from 'classnames'

import s from './VDSmobileItem.module.scss'
import { isUnpaidOrder } from '@utils'

export default function VDSmobileItem({
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
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [originName, setOriginName] = useState('')

  const deleteOption = isUnpaidOrder(server, unpaidItems)

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const handleToolBtnClick = fn => {
    fn()
  }

  const editNameHandler = value => {
    handleEditSubmit(server?.id?.$, { server_name: value })
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
        />
      </span>
      <span className={s.label}>Id:</span>
      <span className={cn(s.value, { [s.active]: isActive })}>{server?.id?.$}</span>
      <span className={s.label}>{t('domain_name')}:</span>
      <span className={s.value}>{server?.domain?.$}</span>
      <span className={s.label}>{t('ip_address')}:</span>
      <span className={s.value}>{server?.ip?.$}</span>
      <span className={s.label}>{t('ostempl')}:</span>
      <span className={s.value}>{server?.ostempl?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$}
        <span className={s.price}>
          {server?.cost?.$?.replace('Month', t('short_month', { ns: 'other' }))}
        </span>
      </span>
      <span className={s.label}>{t('data_center')}:</span>
      <span className={s.value}>{server?.datacentername?.$}</span>
      <span className={s.label}>{t('status')}:</span>
      <ServerState className={s.value} server={server} />
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$?.toLowerCase()?.includes('ddos') ? (
          <div className={s.dailyCharge}>
            <span>{t('daily charges')}</span>
            <a
              target="_blank"
              href={`${process.env.REACT_APP_SITE_URL}/anti-ddos`}
              rel="noreferrer"
            >
              <div />
            </a>
          </div>
        ) : (
          server?.expiredate?.$
        )}
      </span>
    </li>
  )
}

VDSmobileItem.propTypes = {
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
