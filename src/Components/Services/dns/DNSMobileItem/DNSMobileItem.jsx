import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, MoreDots, Edit, Refund, Info, ExitSign } from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
import PropTypes from 'prop-types'

import s from './DNSMobileItem.module.scss'
import { ServerState } from '../../..'

import { dedicOperations } from '../../../../Redux'
import { useDispatch } from 'react-redux'

export default function DNSMobileItem({
  storage,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setActiveServer,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
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
                  className={s.tool_btn}
                  type="button"
                  onClick={() => handleToolBtnClick(setElidForEditModal, storage.id.$)}
                >
                  <Edit className={s.tool_icon} />
                  {t('edit', { ns: 'other' })}
                </button>
              </li>

              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={storage?.status?.$ !== '2'}
                  onClick={() => handleToolBtnClick(setElidForProlongModal, storage.id.$)}
                >
                  <Clock className={s.tool_icon} />
                  {t('prolong')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  onClick={() => {
                    handleToolBtnClick(setElidForHistoryModal, storage.id.$)
                    setActiveServer(storage)
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
                  disabled={storage?.status?.$ !== '2'}
                  onClick={() =>
                    handleToolBtnClick(setElidForInstructionModal, storage.id.$)
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
                  disabled={storage.transition?.$ !== 'on'}
                  onClick={() => {
                    dispatch(dedicOperations.goToPanel(storage.id.$))
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
      <span className={s.value}>{storage?.id?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {storage?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
          .replace('domains', t('domains', { ns: 'dns' }))
          .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
      </span>
      <span className={s.label}>{t('datacenter', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{storage?.datacentername?.$}</span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{storage?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{storage?.expiredate?.$}</span>

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <ServerState className={s.value} server={storage} />
      <span className={s.label}>{t('Price', { ns: 'domains' })}:</span>
      <span className={s.value}>
        {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
      </span>
    </li>
  )
}

DNSMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
}
