import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import DedicIPEditModal from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPEditModal'
import DedicIPList from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPList/DedicIPList'
import DedicIPOrder from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPOrder/DedicIPOrder'
import {
  Backdrop,
  BreadCrumbs,
  Button,
  HintWrapper,
  IconButton,
} from '../../../../Components'
import { useLocation, useNavigate } from 'react-router-dom'

import { dedicOperations } from '../../../../Redux'
import { useDispatch } from 'react-redux'
import { Attention } from '../../../../images'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

import * as route from '../../../../routes'
import s from './DedicIPPage.module.scss'

export default function DedicIPpage() {
  const location = useLocation()
  const ipPlid = location?.state?.plid

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const dispatch = useDispatch()
  const [IPList, setIPList] = useState([])
  const [activeIP, setActiveIP] = useState(null)
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const { t } = useTranslation(['dedicated_servers', 'other', 'crumbs'])

  let isMaxAmountIP = IPList[0]?.addonlimit?.$ === '0'

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForDeleteModal, setElidForDeleteModal] = useState(0)
  const [orderModalOpened, setOrderModalOpened] = useState(false)

  const handleRemoveIPModal = () => {
    setElidForDeleteModal(0)
  }

  const handleRemoveIPBtn = () => {
    dispatch(dedicOperations.removeIP(elidForDeleteModal, ipPlid, handleRemoveIPModal))
  }

  useEffect(() => {
    if (ipPlid) dispatch(dedicOperations.getIPList(ipPlid, setIPList))
  }, [])

  useEffect(() => {
    if (!ipPlid) {
      return navigate(route.DEDICATED_SERVERS)
    }
  }, [ipPlid])

  return (
    <div className={s.page_container}>
      <BreadCrumbs pathnames={parseLocations()} />

      <h3 className={s.ip_title}>
        {t('ip', { ns: 'crumbs' })}
        {isMaxAmountIP && (
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <HintWrapper
              wrapperClassName={s.hint_wrapper}
              popupClassName={s.popup_text}
              label={t('limit_ip', { ns: 'dedicated_servers' })}
            >
              <Attention
                isHovered={hovered}
                className={cn({ [s.attention_icon]: true, [s.hovered]: hovered })}
              />
            </HintWrapper>
          </div>
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
            onClick={() => setOrderModalOpened(true)}
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
          elid={elidForEditModal}
          plid={ipPlid}
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
              onClick={e => {
                e.preventDefault()
                setElidForDeleteModal(0)
              }}
              type="button"
              className={s.close}
            >
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={orderModalOpened}
        onClick={() => setOrderModalOpened(false)}
      >
        <DedicIPOrder
          closeFn={() => {
            setOrderModalOpened(false)
          }}
        />
      </Backdrop>
    </div>
  )
}
