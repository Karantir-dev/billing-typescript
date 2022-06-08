import React, { useEffect, useState } from 'react'
import {
  Backdrop,
  BreadCrumbs,
  Button,
  HintWrapper,
  IconButton,
} from '../../../../Components'
import { useLocation } from 'react-router-dom'

import s from './DedicIPPage.module.scss'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { useDispatch } from 'react-redux'
import DedicIPList from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPList/DedicIPList'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import DedicIPEditModal from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPEditModal'
import { Attention } from '../../../../images'

export default function DedicIPpage() {
  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const dispatch = useDispatch()
  const [IPList, setIPList] = useState([])
  const [activeIP, setActiveIP] = useState(null)
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  const { t } = useTranslation(['dedicated_servers', 'other', 'crumbs'])

  let isMaxAmountIP = IPList[0]?.addonlimit?.$ === '0'

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForDeleteModal, setElidForDeleteModal] = useState(0)

  const handleRemoveIPModal = () => {
    setElidForDeleteModal(0)
  }

  const handleRemoveIPBtn = () => {
    dispatch(dedicOperations.removeIP(activeIP?.id?.$, '3570712', handleRemoveIPModal))
  }

  useEffect(() => {
    dispatch(dedicOperations.getIPList('3570712', setIPList)) // to get ID
  }, [])

  return (
    <div className={s.page_container}>
      <BreadCrumbs pathnames={parseLocations()} />

      <h3 className={s.ip_title}>
        {t('ip', { ns: 'crumbs' })}
        {isMaxAmountIP && (
          <HintWrapper
            wrapperClassName={s.hint_wrapper}
            popupClassName={s.popup_text}
            label={t('limit_ip', { ns: 'dedicated_servers' })}
          >
            <Attention className={s.attention_icon} />
          </HintWrapper>
        )}
      </h3>

      <div className={s.tools_wrapper}>
        {widerThan1550 && (
          <div className={s.icons_wrapper}>
            <div className={s.icon_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeIP?.id?.$)}
                  disabled={!activeIP}
                  icon="edit"
                />
              </HintWrapper>
            </div>
            <HintWrapper label={t('delete', { ns: 'other' })}>
              <IconButton
                className={s.tools_icon}
                onClick={() => setElidForDeleteModal(activeIP?.id?.$)}
                disabled={activeIP?.no_delete?.$ === 'on' || !activeIP}
                icon="delete"
              />
            </HintWrapper>
          </div>
        )}

        <div>
          <Button
            className={s.order_btn}
            isShadow
            type="button"
            label={t('to_order', { ns: 'other' }).toUpperCase()}
            onClick={() => null}
            disabled={isMaxAmountIP}
          />
        </div>
      </div>

      <DedicIPList
        IPList={IPList}
        setActiveIP={setActiveIP}
        activeIP={activeIP}
        setElidForEditModal={setElidForEditModal}
        setElidForDeleteModal={setElidForDeleteModal}
      />
      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForEditModal)}
        onClick={() => setElidForEditModal(0)}
      >
        <DedicIPEditModal
          activeIP={activeIP}
          plid={'3568378'} //to change from URL id
          closeFn={() => setElidForEditModal(0)}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForDeleteModal)}
        onClick={() => setElidForDeleteModal(0)}
      >
        <div className={s.modalCloseBlock}>
          <div className={s.closeText}>
            {t('After accepting your IP-address will be automatically deleted')}
          </div>
          <div className={s.btnCloseBlock}>
            <Button
              onClick={handleRemoveIPBtn}
              className={s.saveBtn}
              isShadow
              size="medium"
              label={t('OK')}
              type="button"
            />
            <button
              onClick={() => setElidForDeleteModal(0)}
              type="button"
              className={s.close}
            >
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        </div>
      </Backdrop>
    </div>
  )
}
