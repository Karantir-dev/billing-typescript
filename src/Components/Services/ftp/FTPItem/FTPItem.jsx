import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './FTPItem.module.scss'
import { CheckBox, ServerState } from '../../..'
import { useDispatch } from 'react-redux'
import { useOutsideAlerter } from '../../../../utils'
import { Clock, Edit, ExitSign, Info, MoreDots, Refund } from '../../../../images'
import { dedicOperations } from '../../../../Redux'

export default function FTPItem({
  storage,
  rights,
  activeServices,
  setActiveServices,
  setElidForProlongModal,
  setElidForEditModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()
  const dropdownEl = useRef()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const serverIsActive = activeServices?.some(
    service => service?.id?.$ === storage?.id?.$,
  )

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  return (
    <div className={s.item_wrapper}>
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

      <div
        className={cn(s.item, {
          [s.active_server]: serverIsActive,
        })}
      >
        <span className={s.value}>{storage?.id?.$}</span>
        <span className={s.value}>{storage?.pricelist?.$}</span>
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
                      disabled={!rights?.edit || storage?.status?.$ === '1'}
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
                      disabled={storage?.status?.$ === '1' || !rights?.prolong}
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Clock className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={!rights?.history || storage?.status?.$ === '1'}
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
                      disabled={storage?.status?.$ === '1' || !rights?.instruction}
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
                        !rights?.gotoserver ||
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

FTPItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
