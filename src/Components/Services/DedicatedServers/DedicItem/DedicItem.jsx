import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import s from './DedicItem.module.scss'
import { CheckBox, EditCell, HintWrapper, ServerState, Icon } from '@components'
import { useDispatch } from 'react-redux'
import { useOutsideAlerter } from '@utils'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { dedicOperations } from '@redux'

export default function DedicItem({
  server,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  activeServices,
  setActiveServices,
  rights,
  handleEditSubmit,
  setIdForDeleteModal,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const [toolsOpened, setToolsOpened] = useState(false)
  const dispatch = useDispatch()
  const dropdownEl = useRef()
  const navigate = useNavigate()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const [originName, setOriginName] = useState('')

  useEffect(() => {
    if (server?.server_name?.$) {
      setOriginName(server?.server_name?.$)
    }
  }, [server])

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === server?.id?.$)

  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== server?.id?.$))
      : setActiveServices([...activeServices, server])
  }

  const handleToolBtnClick = fn => {
    fn()
    setToolsOpened(false)
  }

  const editNameHandler = value => {
    handleEditSubmit(server?.id?.$, value)
    setOriginName(value)
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
        <span className={s.value}>
          <EditCell
            originName={originName}
            onSubmit={editNameHandler}
            placeholder={t(originName || t('server_placeholder', { ns: 'vds' }), {
              ns: 'vds',
            })}
            isShadow={true}
          />
        </span>
        <span className={s.value}>{server?.id?.$}</span>
        <span className={s.value}>
          {server?.domain?.$ ? (
            <HintWrapper
              popupClassName={s.HintWrapper}
              label={server?.domain?.$}
              wrapperClassName={cn(s.hint)}
            >
              <span>{server?.domain?.$}</span>
            </HintWrapper>
          ) : null}
        </span>
        <span className={s.value}>{server?.ip?.$}</span>
        <span className={s.value}>{server?.ostempl?.$}</span>
        <span className={s.value}>
          {server?.pricelist?.$}
          <span className={s.price}>
            {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
          </span>
        </span>

        <ServerState className={s.value} server={server} />
        <span className={s.value}>{server?.createdate?.$}</span>
        <span className={s.value}>{server?.expiredate?.$}</span>

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
                      className={s.tool_btn}
                      type="button"
                      disabled={
                        (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                        server?.item_status?.$?.trim() === 'Suspended by Administrator' ||
                        !rights?.prolong ||
                        server.name?.$.includes('Config 47') ||
                        server.name?.$.includes('Config 48') ||
                        server.name?.$.includes(
                          '[NL] Intel 2xL5630 / 32GB RAM / 2x300GB SSD',
                        ) ||
                        server.name?.$.includes(
                          '[NL] Intel 2xL5630 / 32GB RAM / 2x240GB SSD',
                        ) ||
                        server.name?.$.includes(
                          '[NL] Intel 2xL5640 / 64GB RAM / 2x600GB SSD',
                        )
                      }
                      onClick={() => handleToolBtnClick(setElidForProlongModal)}
                    >
                      <Icon name="Clock" className={s.tool_icon} />
                      {t('prolong')}
                    </button>
                  </li>
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

                  <li className={cn(s.tool_item, s.tool_item_delete)}>
                    <button
                      disabled={
                        server?.status?.$ === '5' ||
                        server?.scheduledclose?.$ === 'on' ||
                        !rights?.delete
                      }
                      className={s.tool_btn}
                      onClick={() => setIdForDeleteModal([server.id.$])}
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

DedicItem.propTypes = {
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
