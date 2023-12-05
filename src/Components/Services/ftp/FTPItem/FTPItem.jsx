import cn from 'classnames'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './FTPItem.module.scss'
import { CheckBox, ServerState, Icon } from '@components'
import { useDispatch } from 'react-redux'
import { useOutsideAlerter } from '@utils'
import { dedicOperations } from '@redux'

export default function FTPItem({
  storage,
  rights,
  activeServices,
  setActiveServices,
  setElidForProlongModal,
  setElidForEditModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setIdForDeleteModal,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()
  const dropdownEl = useRef()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === storage?.id?.$)
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
              <Icon name="Settings" />
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
                      disabled={storage?.status?.$ === '1' || !rights?.instruction}
                      onClick={() => handleToolBtnClick(setElidForInstructionModal)}
                    >
                      <Icon name="Info" className={s.tool_icon} />
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
                      <Icon name="ExitSign" className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={storage?.status?.$ === '1' || !rights?.prolong}
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Icon name="Clock" className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      disabled={!rights?.edit || storage?.status?.$ === '1'}
                      className={s.tool_btn}
                      type="button"
                      onClick={() => handleToolBtnClick(setElidForEditModal)}
                    >
                      <Icon name="Edit" className={s.tool_icon} />
                      {t('edit', { ns: 'other' })}
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
                      <Icon name="Refund" className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>
                  <li className={cn(s.tool_item, s.tool_item_delete)}>
                    <button
                      disabled={
                        storage?.status?.$ === '5' ||
                        storage?.scheduledclose?.$ === 'on' ||
                        !rights?.delete
                      }
                      className={s.tool_btn}
                      onClick={() => setIdForDeleteModal([storage.id.$])}
                    >
                      <Icon
                        name="Delete"
                        className={cn(s.tool_icon, s.tool_icon_delete)}
                      />
                      <p className={s.setting_text}>{t('delete', { ns: 'other' })}</p>
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
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
