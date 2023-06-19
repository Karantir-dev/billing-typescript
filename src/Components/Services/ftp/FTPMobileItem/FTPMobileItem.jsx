import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '@utils'
import PropTypes from 'prop-types'

import s from './FTPMobileItem.module.scss'
import { CheckBox, ServerState, Icon } from '@components'

import { dedicOperations } from '@redux'
import { useDispatch } from 'react-redux'

export default function FTPMobileItem({
  storage,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  activeServices,
  setActiveServices,
  rights,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === storage?.id?.$)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== storage?.id?.$))
      : setActiveServices([...activeServices, storage])
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
              <Icon name="MoreDots" />
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
                      <Icon name="Edit" className={s.tool_icon} />
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
                      <Icon name="Clock" className={s.tool_icon} />
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
                      <Icon name="Refund" className={s.tool_icon} />
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
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <span className={s.label}>Id:</span>
      <span className={s.value}>{storage?.id?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>{storage?.pricelist?.$}</span>
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

FTPMobileItem.propTypes = {
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
