import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import * as route from '../../../../routes'
import { useNavigate } from 'react-router-dom'
import { shortTitle, useOutsideAlerter } from '../../../../utils'
import { CheckBox, HintWrapper, ServerState } from '../../..'
import PropTypes from 'prop-types'
import cn from 'classnames'

import s from './VDSmobileItem.module.scss'

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
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()
  const navigate = useNavigate()
  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const [isEdit, setIsEdit] = useState(false)
  const [editName, setEditName] = useState('')

  const editField = useRef()

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const closeEditHandler = () => {
    setIsEdit(!isEdit)
    setEditName('')
  }

  useOutsideAlerter(editField, isEdit, closeEditHandler)

  const editNameHandler = () => {
    handleEditSubmit(server?.id?.$, { server_name: editName })

    setIsEdit(false)
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0
  const serverIsActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)

  return (
    <li className={s.item}>
      {isToolsBtnVisible && (
        <div className={s.tools_wrapper}>
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
                        navigate(route.VDS_IP, { state: { id: server?.id?.$ } })
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
        </div>
      )}
      <span className={s.label}>{t('server_name')}:</span>
      <span className={cn(s.value, { [s.active]: serverIsActive })}>
        {!isEdit ? (
          <>
            {server?.server_name?.$ && server?.server_name?.$?.length < 13 ? (
              <div
                style={isEdit ? { overflow: 'inherit' } : {}}
                className={cn(s.item_text, s.first_item)}
                ref={editField}
              >
                <>
                  <button
                    onClick={() => {
                      setIsEdit(!isEdit)
                      setEditName(server?.server_name?.$?.trim())
                    }}
                  >
                    <Edit />
                  </button>

                  <span>
                    {t(
                      shortTitle(editName, 12) ||
                        shortTitle(server?.server_name?.$?.trim(), 12),
                      {
                        ns: 'vds',
                      },
                    )}
                  </span>
                </>
              </div>
            ) : (
              <HintWrapper
                popupClassName={s.HintWrapper}
                label={t(editName || server?.server_name?.$?.trim(), {
                  ns: 'vds',
                })}
              >
                <div
                  style={isEdit ? { overflow: 'inherit' } : {}}
                  className={cn(s.item_text, s.first_item)}
                  ref={editField}
                >
                  <>
                    <button
                      onClick={() => {
                        setIsEdit(!isEdit)
                        setEditName(server?.server_name?.$?.trim())
                      }}
                    >
                      <Edit />
                    </button>

                    <span>
                      {t(
                        shortTitle(editName, 12) ||
                          shortTitle(server?.server_name?.$?.trim(), 12),
                        {
                          ns: 'vds',
                        },
                      )}
                    </span>
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
              <button className={s.editBtnOk} onClick={editNameHandler}>
                <CheckEdit />
              </button>
              <input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
          </div>
        )}
      </span>
      <span className={s.label}>Id:</span>
      <span className={cn(s.value, { [s.active]: serverIsActive })}>{server?.id?.$}</span>
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
      <ServerState server={server} />
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$?.toLowerCase()?.includes('ddos') ? (
          <div className={s.dailyCharge}>
            <span>{t('daily charges')}</span>
            <a target="_blank" href="https://zomro.com/ua/anti-ddos" rel="noreferrer">
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
