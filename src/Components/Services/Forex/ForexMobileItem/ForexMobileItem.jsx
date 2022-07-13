import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, MoreDots, Edit, Refund, Delete } from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
import PropTypes from 'prop-types'

import s from './ForexMobileItem.module.scss'
import { ServerState } from '../../..'

export default function ForexMobileItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForDeletionModal,
  setActiveServer,
  pageRights,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)

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
                  disabled={!pageRights?.edit || server?.status?.$ === '1'}
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
                  disabled={server?.status?.$ === '1' || !pageRights?.prolong}
                  onClick={() => handleToolBtnClick(setElidForProlongModal, server.id.$)}
                >
                  <Clock className={s.tool_icon} />
                  {t('prolong')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  disabled={!pageRights?.history || server?.status?.$ === '1'}
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
                  disabled={
                    !server.id.$ || !pageRights?.delete || server?.status?.$ === '1'
                  }
                  onClick={() => {
                    handleToolBtnClick(setElidForDeletionModal, server.id.$)
                    setActiveServer(server)
                  }}
                >
                  <Delete className={s.tool_icon} />
                  {t('delete', { ns: 'other' })}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <span className={s.label}>Id:</span>
      <span className={s.value}>{server?.id?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
          .replace('domains', t('domains', { ns: 'dns' }))
          .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
      </span>
      <span className={s.label}>{t('datacenter', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{server?.datacentername?.$}</span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <ServerState className={s.value} server={server} />
      <span className={s.label}>{t('Price', { ns: 'domains' })}:</span>
      <span className={s.value}>
        {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
      </span>
    </li>
  )
}

ForexMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  pageRights: PropTypes.object,
}
