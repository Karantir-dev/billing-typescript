import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
  BreadCrumbs,
} from '../../../Components'
import DedicList from '../../../Components/Services/DedicatedServers/DedicList/DedicList'
import dedicOperations from '../../../Redux/dedicatedServers/dedicOperations'
import { useDispatch, useSelector } from 'react-redux'
import dedicSelectors from '../../../Redux/dedicatedServers/dedicSelectors'
import EditServerModal from '../../../Components/Services/DedicatedServers/EditServerModal/EditServerModal'

import s from './DedicatedServicesPage.module.scss'

export default function DedicatedServersPage() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const serversList = useSelector(dedicSelectors.getServersList)
  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  useEffect(() => {
    dispatch(dedicOperations.getServersList())
  }, [])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dedicated_servers', { ns: 'container' })}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <IconButton
            className={cn({ [s.tools_icon]: true, [s.filter_icon]: true })}
            icon="filter"
          />

          {widerThan1550 && (
            <div className={s.desktop_tools_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={!activeServer}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper label={t('reload')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.show_reboot?.$ !== 'on'}
                  icon="reload"
                />
              </HintWrapper>
              <HintWrapper label={t('ip_addresses')}>
                <NavLink to={route.DEDICATED_SERVERS_IP}>
                  <IconButton
                    className={s.tools_icon}
                    disabled={activeServer?.has_ip_pricelist?.$ !== 'on'}
                    icon="ip"
                  />
                </NavLink>
              </HintWrapper>
              <HintWrapper label={t('prolong')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2'}
                  icon="clock"
                />
              </HintWrapper>
              <HintWrapper label={t('history')}>
                <IconButton className={s.tools_icon} icon="refund" />
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
            </div>
          )}
        </div>

        <Button
          className={s.order_btn}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
          onClick={() => navigate(route.DEDICATED_SERVERS_ORDER)}
        />
      </div>
      <DedicList
        servers={serversList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setActiveServer={setActiveServer}
      />
      <Backdrop isOpened={Boolean(elidForEditModal)}>
        <EditServerModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>
    </>
  )
}
