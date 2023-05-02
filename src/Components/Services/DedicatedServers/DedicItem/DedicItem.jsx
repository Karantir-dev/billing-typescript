import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DedicItem.module.scss'
import { CheckBox, HintWrapper, ServerState } from '../../../'
import { useDispatch } from 'react-redux'
import { shortTitle, useOutsideAlerter } from '../../../../utils'
import {
  CheckEdit,
  Clock,
  Edit,
  ExitSign,
  Info,
  IP,
  MoreDots,
  Refund,
  Reload,
} from '../../../../images'
import { useNavigate } from 'react-router-dom'
import * as route from '../../../../routes'
import { dedicOperations } from '../../../../Redux'

export default function DedicItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  activeServices,
  setActiveServices,
  rights,
  handleEditSubmit,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()
  const dropdownEl = useRef()
  const navigate = useNavigate()

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

  const closeEditHandler = () => {
    setIsEdit(!isEdit)
    setEditName('')
  }

  useOutsideAlerter(editField, isEdit, closeEditHandler)

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const serverIsActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const editNameHandler = () => {
    handleEditSubmit(server?.id?.$, editName)
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

      <div
        className={cn(s.item, {
          [s.active_server]: serverIsActive,
        })}
        // type="button"
        // onClick={() => setActiveServer(server)}
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
                  wrapperClassName={cn(s.hint)}
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
        <span className={s.value}>
          <HintWrapper
            popupClassName={s.HintWrapper}
            label={server?.domain?.$}
            wrapperClassName={cn(s.hint)}
          >
            <span>{server?.domain?.$}</span>
          </HintWrapper>
        </span>
        <span className={s.value}>{server?.ip?.$}</span>
        <span className={s.value}>{server?.ostempl?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$}
          <span className={s.price}>
            {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>

        <ServerState className={s.value} server={server} />
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>

        {isToolsBtnVisible && (
          <div
            className={cn(s.dots_wrapper, s.value, {
              [s.disabled]: false,
            })}
          >
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
                      onClick={() => handleToolBtnClick(setElidForEditModal, server.id.$)}
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
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        server?.item_status?.$?.trim() === 'Suspended by Administrator' ||
                        !rights?.prolong
                      }
                      onClick={() =>
                        handleToolBtnClick(setElidForProlongModal, server.id.$)
                      }
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
                      onClick={() =>
                        handleToolBtnClick(setElidForInstructionModal, server.id.$)
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
        )}
      </div>
    </div>
  )
}

DedicItem.propTypes = {
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
