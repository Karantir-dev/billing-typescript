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
} from '../../../../images'
import * as route from '../../../../routes'
import { useNavigate } from 'react-router-dom'
import { useOutsideAlerter } from '../../../../utils'
import { ServerState } from '../../..'
import PropTypes from 'prop-types'

import s from './VDSmobileItem.module.scss'

export default function VDSmobileItem({
  server,
  rights,
  setElidForEditModal,
  setIdForDeleteModal,
  setIdForPassChange,
  setIdForReboot,
  setIdForProlong,
  setIdForHistory,
  setIdForInstruction,
  goToPanel,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()
  const navigate = useNavigate()
  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  return (
    <li className={s.item}>
      {isToolsBtnVisible && (
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
                {rights?.edit && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setElidForEditModal)}
                      disabled={server?.status?.$ !== '2'}
                    >
                      <Edit className={s.tool_icon} />
                      {t('edit', { ns: 'other' })}
                    </button>
                  </li>
                )}
                {rights?.changepassword && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForPassChange)}
                      disabled={server.allow_changepassword?.$ !== 'on'}
                    >
                      <PassChange className={s.tool_icon} />
                      {t('password_change')}
                    </button>
                  </li>
                )}
                {rights?.reboot && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForReboot)}
                      disabled={server.show_reboot?.$ !== 'on'}
                    >
                      <Reload className={s.tool_icon} />
                      {t('reload')}
                    </button>
                  </li>
                )}
                {rights?.ip && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() =>
                        navigate(route.VDS_IP, { state: { id: server?.id.$ } })
                      }
                      disabled={server.has_ip_pricelist?.$ !== 'on'}
                    >
                      <IP className={s.tool_icon} />
                      {t('ip_addresses')}
                    </button>
                  </li>
                )}
                {rights?.prolong && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForProlong)}
                      disabled={server?.status?.$ !== '2'}
                    >
                      <Clock className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                )}
                {rights?.history && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForHistory)}
                      disabled={server?.status?.$ !== '2'}
                    >
                      <Refund className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>
                )}
                {rights?.instruction && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForInstruction)}
                      disabled={server?.status?.$ !== '2'}
                    >
                      <Info className={s.tool_icon} />
                      {t('instruction')}
                    </button>
                  </li>
                )}
                {rights?.gotoserver && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(goToPanel)}
                      disabled={server.transition?.$ !== 'on'}
                    >
                      <ExitSign className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>
                )}
                {rights?.delete && (
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setIdForDeleteModal)}
                    >
                      <Delete className={s.tool_icon} />
                      {t('delete', { ns: 'other' })}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
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
      <span className={s.label}>{t('data_center')}:</span>
      <span className={s.value}>{server?.datacentername?.$}</span>
      <span className={s.label}>{t('status')}:</span>
      <ServerState server={server} />
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>
    </li>
  )
}

VDSmobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
}
