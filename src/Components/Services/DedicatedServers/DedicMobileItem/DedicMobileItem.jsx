import React, { useRef, useState } from 'react'
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
} from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
import PropTypes from 'prop-types'

import s from './DedicMobileItem.module.scss'
import { ServerState } from '../../../'
import { useNavigate } from 'react-router-dom'
import * as route from '../../../../routes'
import { dedicOperations } from '../../../../Redux'
import { useDispatch } from 'react-redux'

export default function DedicMobileItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  setActiveServer,
  rights,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = (fn, id) => {
    fn(id)
    setToolsOpened(false)
  }

  return (
    <li className={s.item}>
      <div className={s.dots_wrapper}>
        <button className={s.dots_btn} type="button" onClick={() => setToolsOpened(true)}>
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
                    handleToolBtnClick(setElidForRebootModal, server?.id?.$)
                    setActiveServer(server)
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
                  onClick={() => handleToolBtnClick(setElidForProlongModal, server.id.$)}
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
                    handleToolBtnClick(setElidForHistoryModal, server.id.$)
                    setActiveServer(server)
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
  rights: PropTypes.object,
}
