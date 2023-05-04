import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DNSItem.module.scss'
import { CheckBox, ServerState } from '../../..'
import { Clock, Edit, ExitSign, Info, MoreDots, Refund } from '../../../../images'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '../../../../Redux'
import { useOutsideAlerter } from '../../../../utils'

export default function DNSItem({
  storage,
  pageRights,
  activeServices,
  setActiveServices,
  setElidForProlongModal,
  setElidForEditModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
}) {
  const { t } = useTranslation(['vds', 'other', 'dns', 'crumbs'])

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()
  const dropdownEl = useRef()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const isToolsBtnVisible =
    Object.keys(pageRights)?.filter(
      key => key !== 'ask' && key !== 'filter' && key !== 'new',
    ).length > 0

  const isActive = activeServices?.some(
    service => service?.id?.$ === storage?.id?.$,
  )

  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== storage?.id?.$))
      : setActiveServices([...activeServices, storage])
  }

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  return (
    <div className={s.item_wrapper}>
      <CheckBox
        className={s.check_box}
        value={isActive}
        onClick={toggleIsActiveHandler}
      />

      <div
        className={cn(s.item, {
          [s.active_server]: isActive,
        })}
      >
        <span className={s.value}>{storage?.id?.$}</span>
        <span className={s.value}>
          {storage?.pricelist?.$.replace('for', t('for', { ns: 'dns' }))
            .replace('domains', t('domains', { ns: 'dns' }))
            .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
        </span>
        <span className={s.value}>{storage?.datacentername?.$}</span>
        <span className={s.value}>{storage?.createdate?.$}</span>
        <span className={s.value}>{storage?.expiredate?.$}</span>
        <ServerState className={s.value} server={storage} />

        <span className={s.value}>
          {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>

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
        )}
      </div>
    </div>
  )
}

DNSItem.propTypes = {
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  pageRights: PropTypes.object,
}
