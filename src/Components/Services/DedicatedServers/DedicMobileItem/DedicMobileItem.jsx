import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Clock,
  MoreDots,
  Edit,
  Reload,
  Refund,
  IP,
  Info,
  ExitSign,
  CheckEdit,
} from '../../../../images'
import { shortTitle, useOutsideAlerter } from '../../../../utils'
import PropTypes from 'prop-types'

import s from './DedicMobileItem.module.scss'
import { CheckBox, HintWrapper, ServerState } from '../../../'
import { useNavigate } from 'react-router-dom'
import * as route from '../../../../routes'
import { dedicOperations } from '../../../../Redux'
import { useDispatch } from 'react-redux'
import cn from 'classnames'

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
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isEdit, setIsEdit] = useState(false)
  const [originName, setOriginName] = useState('')
  const [editName, setEditName] = useState('')

  const editField = useRef()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const closeEditHandler = () => {
    setIsEdit(!isEdit)
    setEditName('')
  }

  useOutsideAlerter(editField, isEdit, closeEditHandler)

  const editNameHandler = () => {
    handleEditSubmit(server?.id?.$, editName)
    setOriginName(editName)
    setIsEdit(false)
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
  
  return (
    <li className={s.item}>
      {isToolsBtnVisible && (
        <div className={s.tools_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isActive}
            onClick={toggleIsActiveHandler}
          />
          <div className={s.dots_wrapper}>
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
                      disabled={!rights?.edit}
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setElidForEditModal)}
                    >
                      <Edit className={s.tool_icon} />
                      {t('edit', { ns: 'other' })}
                    </button>
                  </li>

                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={server.show_reboot?.$ !== 'on' || !rights?.reboot}
                      onClick={() => {
                        handleToolBtnClick(setElidForRebootModal)
                      }}
                    >
                      <Reload className={s.tool_icon} />
                      {t('reload')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={server.has_ip_pricelist?.$ !== 'on' || !rights?.ip}
                      onClick={() =>
                        navigate(route.DEDICATED_SERVERS_IP, {
                          state: { plid: server?.id?.$, isIpAllowedRender: rights?.ip },
                          replace: true,
                        })
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
                      disabled={server?.status?.$ === '1' || !rights?.prolong}
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Clock className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      disabled={server?.status?.$ === '1' || !rights?.history}
                      className={s.tool_btn}
                      type="button"
                      onClick={() => {
                        handleToolBtnClick(setElidForHistoryModal)
                      }}
                    >
                      <Refund className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={server?.status?.$ === '1' || !rights?.instruction}
                      onClick={() => handleToolBtnClick(setElidForInstructionModal)}
                    >
                      <Info className={s.tool_icon} />
                      {t('instruction')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={
                        server.transition?.$ !== 'on' ||
                        server?.status?.$ !== '2' ||
                        !rights?.gotoserver
                      }
                      onClick={() => {
                        dispatch(dedicOperations.goToPanel(server.id.$))
                      }}
                    >
                      <ExitSign className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <span className={s.label}>{t('server_name')}:</span>
      <span className={cn(s.value, { [s.active]: isActive })}>
        {!isEdit ? (
          <>
            {originName && originName?.length < 13 ? (
              <div
                style={isEdit ? { overflow: 'inherit' } : {}}
                className={cn(s.item_text, s.first_item)}
                ref={editField}
              >
                <>
                  <button
                    onClick={() => {
                      setIsEdit(!isEdit)
                      setEditName(originName?.trim())
                    }}
                  >
                    <Edit />
                  </button>

                  <span>
                    {t(
                      shortTitle(editName, 12) ||
                        shortTitle(originName?.trim(), 12) ||
                        t('server_placeholder', { ns: 'vds' }),
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
                label={t(
                  editName ||
                    originName?.trim() ||
                    t('server_placeholder', { ns: 'vds' }),
                  {
                    ns: 'vds',
                  },
                )}
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
                        setEditName(originName?.trim())
                      }}
                    >
                      <Edit />
                    </button>

                    <span>
                      {t(
                        shortTitle(editName, 12) ||
                          shortTitle(originName?.trim(), 12) ||
                          t('server_placeholder', { ns: 'vds' }),
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
      <span className={s.value}>{server?.id?.$}</span>
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
