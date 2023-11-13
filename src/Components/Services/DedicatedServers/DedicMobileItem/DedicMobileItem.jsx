import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '@utils'
import PropTypes from 'prop-types'
import s from './DedicMobileItem.module.scss'
import { CheckBox, EditCell, ServerState, Icon } from '@components'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { dedicOperations } from '@redux'
import { useDispatch } from 'react-redux'
import cn from 'classnames'

export default function DedicMobileItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  rights,
  setActiveServices,
  activeServices,
  handleEditSubmit,
  setIdForDeleteModal,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [originName, setOriginName] = useState('')

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const editNameHandler = value => {
    handleEditSubmit(server?.id?.$, value)
    setOriginName(value)
  }

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== server?.id?.$))
      : setActiveServices([...activeServices, server])
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
                      disabled={!rights?.edit}
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
                      disabled={server.show_reboot?.$ !== 'on' || !rights?.reboot}
                      onClick={() => {
                        handleToolBtnClick(setElidForRebootModal)
                      }}
                    >
                      <Icon name="Reload" className={s.tool_icon} />
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
                      <Icon name="IP" className={s.tool_icon} />
                      {t('ip_addresses')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={server?.status?.$ === '1' || !rights?.prolong}
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Icon name="Clock" className={s.tool_icon} />
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
                      <Icon name="Refund" className={s.tool_icon} />
                      {t('history')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      className={s.tool_btn}
                      type="button"
                      disabled={server?.status?.$ === '1' || !rights?.instruction}
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
                        server.transition?.$ !== 'on' ||
                        server?.status?.$ !== '2' ||
                        !rights?.gotoserver
                      }
                      onClick={() => {
                        dispatch(dedicOperations.goToPanel(server.id.$))
                      }}
                    >
                      <Icon name="ExitSign" className={s.tool_icon} />
                      {t('go_to_panel')}
                    </button>
                  </li>
                  <li className={s.tool_item}>
                    <button
                      disabled={
                        server?.status?.$ === '5' ||
                        server?.scheduledclose?.$ === 'on' ||
                        !rights?.delete
                      }
                      className={s.tool_btn}
                      onClick={() => setIdForDeleteModal([server.id.$])}
                    >
                      <Icon name="Delete" className={s.tool_icon} />
                      <p className={s.setting_text}>{t('delete', { ns: 'other' })}</p>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <span className={s.label}>{t('server_name')}:</span>
      <span className={cn(s.value, s.value_edit, { [s.active]: isActive })}>
        <EditCell
          originName={originName}
          onSubmit={editNameHandler}
          placeholder={t(originName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          className={s.edit_cell}
        />
      </span>

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
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setElidForRebootModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
  handleEditSubmit: PropTypes.func,
}
