import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBox, HintWrapper, ServerState } from '../../..'
import PropTypes from 'prop-types'
import * as route from '../../../../routes'
import {
  Clock,
  MoreDots,
  Edit,
  PassChange,
  Reload,
  Refund,
  IP,
  Info,
  Delete,
  ExitSign,
  CheckEdit,
} from '../../../../images'
import { shortTitle, useOutsideAlerter } from '../../../../utils'
import { useNavigate } from 'react-router-dom'
import { SITE_URL } from '../../../../config/config'
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
}) {
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()
  const dropdownEl = useRef()
  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const [isEdit, setIsEdit] = useState(false)
  const [originName, setOriginName] = useState('')
  const [editName, setEditName] = useState('')

  const editField = useRef()

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const closeEditHandler = () => {
    setIsEdit(!isEdit)
    setEditName('')
  }

  useOutsideAlerter(editField, isEdit, closeEditHandler)

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const serverIsActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)

  const editNameHandler = () => {
    handleEditSubmit(server?.id?.$, { server_name: editName }, setOriginName)
    setOriginName(editName)
    setIsEdit(false)
  }

  return (
    <div className={s.item_wrapper}>
      <CheckBox
        className={s.check_box}
        initialState={serverIsActive}
        func={isChecked => {
          isChecked
            ? setActiveServices(
                activeServices?.filter(item => item?.id?.$ !== server?.id?.$),
              )
            : setActiveServices([...activeServices, server])
        }}
      />

      <li
        className={cn(s.item, {
          [s.active_server]: serverIsActive,
        })}
      >
        <span className={s.value}>
          {!isEdit ? (
            <>
              {!originName || (originName && originName?.length < 13) ? (
                <div
                  style={isEdit ? { overflow: 'inherit' } : {}}
                  className={cn(s.item_text, s.first_item)}
                  ref={editField}
                >
                  <>
                    <span
                      className={cn({
                        [s.placeholder_text]: editName === '' && originName === '',
                      })}
                    >
                      {t(
                        shortTitle(editName, 12) ||
                          shortTitle(originName?.trim(), 12) ||
                          t('server_placeholder', { ns: 'vds' }),
                        {
                          ns: 'vds',
                        },
                      )}
                    </span>
                    <button
                      className={s.edit_btn}
                      onClick={() => {
                        setIsEdit(!isEdit)
                        setEditName(originName?.trim())
                      }}
                    >
                      <Edit />
                    </button>
                  </>
                </div>
              ) : (
                <HintWrapper
                  popupClassName={s.HintWrapper}
                  label={t(editName || originName?.trim(), {
                    ns: 'vds',
                  })}
                >
                  <div
                    style={isEdit ? { overflow: 'inherit' } : {}}
                    className={cn(s.item_text, s.first_item)}
                    ref={editField}
                  >
                    <>
                      <span
                        className={cn({
                          [s.placeholder_text]: editName === '' && originName === '',
                        })}
                      >
                        {t(
                          shortTitle(editName, 12) ||
                            shortTitle(originName?.trim(), 12) ||
                            t('server_placeholder', { ns: 'vds' }),
                          {
                            ns: 'vds',
                          },
                        )}
                      </span>
                      <button
                        className={s.edit_btn}
                        onClick={() => {
                          setIsEdit(!isEdit)
                          setEditName(originName?.trim())
                        }}
                      >
                        <Edit />
                      </button>
                    </>
                  </div>
                </HintWrapper>
              )}
            </>
          ) : (
            <div
              style={isEdit ? { overflow: 'inherit' } : {}}
              className={cn(s.item_text, s.first_item)}
              ref={editField}
            >
              <div className={s.editBlock}>
                <input
                  placeholder={editName ? '' : t('server_placeholder', { ns: 'vds' })}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <button className={s.editBtnOk} onClick={editNameHandler}>
                  <CheckEdit />
                </button>
              </div>
            </div>
          )}
        </span>
        <span className={s.value}>{server?.id?.$}</span>
        <span title={server?.domain?.$} className={s.value}>
          {server?.domain?.$}
        </span>
        <span className={s.value}>{server?.ip?.$}</span>
        <span className={s.value}>{server?.ostempl?.$}</span>
        <span className={s.value}>{server?.datacentername?.$}</span>
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>
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
        <ServerState className={s.value} server={server} />
        <span className={s.value}>
          {server?.pricelist?.$}
          <span className={s.price}>
            {server?.cost?.$?.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>
        {isToolsBtnVisible && (
          <div className={cn(s.dots_wrapper, { [s.disabled]: false })}>
            <button
              className={s.dots_btn}
              type="button"
              onClick={() => setToolsOpened(true)}
            >
              <MoreDots />
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
                      onClick={() => handleToolBtnClick(setIdForEditModal)}
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        !rights?.edit
                      }
                    >
                      <Edit className={s.tool_icon} />
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
                      <PassChange className={s.tool_icon} />
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
                      <Reload className={s.tool_icon} />
                      {t('reload')}
                    </button>
                  </li>

                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() =>
                        navigate(route.VPS_IP, { state: { id: server?.id?.$ } })
                      }
                      disabled={
                        server?.status?.$ === '5' ||
                        server?.has_ip_pricelist?.$ !== 'on' ||
                        !rights?.ip
                      }
                    >
                      <IP className={s.tool_icon} />
                      {t('ip_addresses')}
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
                        !rights?.prolong
                      }
                    >
                      <Clock className={s.tool_icon} />
                      {t('prolong')}
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
                      <Refund className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>

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
                      <Info className={s.tool_icon} />
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
                      <ExitSign className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>

                  <li className={s.tool_item}>
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
                      <Delete className={s.tool_icon} />
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
