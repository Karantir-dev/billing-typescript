import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux'
import * as route from '../../../../routes'
import {
  Button,
  IconButton,
  VDSList,
  HintWrapper,
  EditModal,
  Backdrop,
  BreadCrumbs,
  DeleteModal,
  VDSPasswordChange,
  RebootModal,
  ProlongModal,
} from '../../../../Components'
import { vdsOperations } from '../../../../Redux'

import s from './VDS.module.scss'

export default function VDS() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [servers, setServers] = useState()
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [activeServer, setActiveServer] = useState(null)
  const [idForDeleteModal, setIdForDeleteModal] = useState('')
  const [idForProlong, setIdForProlong] = useState('')
  const [idForPassChange, setIdForPassChange] = useState('')
  const [idForReboot, setIdForReboot] = useState('')

  useEffect(() => {
    dispatch(vdsOperations.getVDS(setServers))
  }, [])

  const deleteServer = () => {
    dispatch(vdsOperations.deleteVDS(idForDeleteModal, setServers))
    setActiveServer(null)
    setIdForDeleteModal('')
  }

  const getSarverName = id => {
    return servers?.reduce((acc, el) => {
      if (el.id.$ === id) {
        acc = el.name.$
      }
      return acc
    }, '')
  }

  return (
    <>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className={s.title}>{t('servers_title')}</h2>
      <div className={s.tools_wrapper}>
        <IconButton className={s.tools_icon} icon="filter" />

        {widerThan1550 && (
          <>
            <div className={s.edit_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer.id.$)}
                  disabled={activeServer?.status?.$ !== '2'}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper label={t('delete', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setIdForDeleteModal(activeServer.id.$)}
                  disabled={!activeServer || activeServer.item_status.$ === '5_open'}
                  icon="delete"
                />
              </HintWrapper>
            </div>

            <HintWrapper label={t('password_change')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.allow_changepassword?.$ !== 'on'}
                onClick={() => setIdForPassChange(activeServer.id.$)}
                icon="passChange"
              />
            </HintWrapper>
            <HintWrapper label={t('reload')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.show_reboot?.$ !== 'on'}
                onClick={() => setIdForReboot(activeServer.id.$)}
                icon="reload"
              />
            </HintWrapper>
            <HintWrapper label={t('ip_addresses')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.has_ip_pricelist?.$ !== 'on'}
                onClick={() =>
                  navigate(route.VDS_IP, { state: { id: activeServer.id.$ } })
                }
                icon="ip"
              />
            </HintWrapper>
            <HintWrapper label={t('prolong')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.status?.$ !== '2'}
                onClick={() => setIdForProlong(activeServer.id.$)}
                icon="clock"
              />
            </HintWrapper>
            <HintWrapper label={t('history')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.status?.$ !== '2'}
                icon="refund"
              />
            </HintWrapper>
            <HintWrapper label={t('instruction')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.status?.$ !== '2'}
                icon="info"
              />
            </HintWrapper>
            <HintWrapper label={t('go_to_panel')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.transition?.$ !== 'on'}
                icon="exitSign"
              />
            </HintWrapper>
          </>
        )}
        <Button
          className={s.btn_order}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' })}
          onClick={() => navigate(route.VDS_ORDER)}
        />
      </div>

      <VDSList
        servers={servers}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setActiveServer={setActiveServer}
        setIdForDeleteModal={setIdForDeleteModal}
        setIdForPassChange={setIdForPassChange}
        setIdForReboot={setIdForReboot}
        setIdForProlong={setIdForProlong}
      />

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForEditModal)}
        onClick={() => setElidForEditModal(0)}
      >
        <EditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        isOpened={Boolean(idForDeleteModal)}
        onClick={() => setIdForDeleteModal('')}
      >
        <DeleteModal
          name={getSarverName(idForDeleteModal)}
          deleteFn={deleteServer}
          closeFn={() => setIdForDeleteModal('')}
        />
      </Backdrop>

      <Backdrop
        isOpened={Boolean(idForPassChange)}
        onClick={() => setIdForPassChange('')}
      >
        <VDSPasswordChange
          id={idForPassChange}
          name={getSarverName(idForPassChange)}
          closeFn={() => setIdForPassChange('')}
        />
      </Backdrop>

      <Backdrop isOpened={Boolean(idForReboot)} onClick={() => setIdForReboot('')}>
        <RebootModal
          id={idForReboot}
          name={getSarverName(idForReboot)}
          closeFn={() => setIdForReboot('')}
        />
      </Backdrop>

      <Backdrop isOpened={Boolean(idForProlong)} onClick={() => setIdForProlong('')}>
        <ProlongModal elid={idForProlong} closeFn={() => setIdForProlong('')} />
      </Backdrop>
    </>
  )
}
