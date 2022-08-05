import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, MoreDots, Edit, Refund, Info, ExitSign } from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
import PropTypes from 'prop-types'

import s from './DNSMobileItem.module.scss'
import { CheckBox, ServerState } from '../../..'

import { dedicOperations } from '../../../../Redux'
import { useDispatch } from 'react-redux'

export default function DNSMobileItem({
  storage,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  pageRights,
  activeServices,
  setActiveServices,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const isToolsBtnVisible =
    Object.keys(pageRights)?.filter(
      key => key !== 'ask' && key !== 'filter' && key !== 'new',
    ).length > 0

  const serverIsActive = activeServices?.some(
    service => service?.id?.$ === storage?.id?.$,
  )

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
                    activeServices?.filter(item => item?.id?.$ !== storage?.id?.$),
                  )
                : setActiveServices([...activeServices, storage])
            }}
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
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setElidForEditModal)}
                      disabled={!pageRights?.edit || storage?.status?.$ === '1'}
                    >
                      <Edit className={s.tool_icon} />
                      {t('edit', { ns: 'other' })}
                    </button>
                  </li>

                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={storage?.status?.$ === '1' || !pageRights?.prolong}
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Clock className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      disabled={!pageRights?.history || storage?.status?.$ === '1'}
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
                      disabled={storage?.status?.$ === '1' || !pageRights?.instruction}
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
                        storage.transition?.$ !== 'on' ||
                        !pageRights?.gotoserver ||
                        storage?.status?.$ !== '2'
                      }
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
        </div>
      )}

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
  pageRights: PropTypes.object,
}
