import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBox, HintWrapper, ServerState, EditCell, Icon } from '@components'
import PropTypes from 'prop-types'
import * as route from '@src/routes'
import { useOutsideAlerter } from '@utils'
import { useNavigate } from 'react-router-dom'
import { SITE_URL } from '@config/config'
import s from './VDSItem.module.scss'

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
}) {
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()
  const dropdownEl = useRef()
  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const [originName, setOriginName] = useState('')

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
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
            <HintWrapper
              popupClassName={s.HintWrapper}
              label={server?.domain?.$}
              wrapperClassName={cn(s.hint)}
            >
              <span>{server?.domain?.$}</span>
            </HintWrapper>
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
              <a target="_blank" href={`${SITE_URL}/anti-ddos`} rel="noreferrer">
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
        {isToolsBtnVisible && (
          <div className={cn(s.dots_wrapper, { [s.disabled]: false })}>
            <button
              className={s.dots_btn}
              type="button"
              onClick={() => setToolsOpened(true)}
            >
              <Icon name="Settings" />
            </button>

            {toolsOpened && (
              <div className={s.dropdown} ref={dropdownEl}>
                <div className={s.pointer_wrapper}>
                  <div className={s.pointer}></div>
                </div>
                <ul>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForInstruction)}
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        !rights?.instruction
                      }
                    >
                      <Icon name="Info" className={s.tool_icon} />
                      {t('instruction')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(goToPanelFn)}
                      disabled={
                        server?.transition?.$ !== 'on' ||
                        server?.status?.$ !== '2' ||
                        !rights?.gotoserver
                      }
                    >
                      <Icon name="ExitSign" className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForProlong)}
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        server?.item_status?.$?.trim() === 'Suspended by Administrator' ||
                        !rights?.prolong ||
                        server?.pricelist?.$?.toLowerCase()?.includes('ddos')
                      }
                    >
                      <Icon name="Clock" className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForEditModal)}
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        !rights?.edit
                      }
                    >
                      <Icon name="Edit" className={s.tool_icon} />
                      {t('edit', { ns: 'other' })}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForPassChange)}
                      disabled={
                        server?.allow_changepassword?.$ !== 'on' ||
                        !rights?.changepassword ||
                        server?.ostempl?.$?.includes('Windows')
                      }
                    >
                      <Icon name="PassChange" className={s.tool_icon} />
                      {t('password_change')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForReboot)}
                      disabled={server?.show_reboot?.$ !== 'on' || !rights?.reboot}
                    >
                      <Icon name="Reload" className={s.tool_icon} />
                      {t('reload')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() =>
                        navigate(route.VPS_IP, {
                          state: { id: server?.id?.$ },
                          replace: true,
                        })
                      }
                      disabled={
                        server?.status?.$ === '5' ||
                        server?.has_ip_pricelist?.$ !== 'on' ||
                        !rights?.ip
                      }
                    >
                      <Icon name="IP" className={s.tool_icon} />
                      {t('ip_addresses')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForHistory)}
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        !rights?.history
                      }
                    >
                      <Icon name="Refund" className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>
                  <li className={cn(s.tool_item, s.tool_item_delete)}>
                    <button
                      disabled={
                        server?.status?.$ === '5' ||
                        server?.scheduledclose?.$ === 'on' ||
                        !rights?.delete
                      }
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForDeleteModal)}
                    >
                      <Icon
                        name="Delete"
                        className={cn(s.tool_icon, s.tool_icon_delete)}
                      />
                      {t('delete', { ns: 'other' })}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
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
