import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import cn from 'classnames'
import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
  BreadCrumbs,
} from '../../../Components'
import { useMediaQuery } from 'react-responsive'
import s from './DedicatedServicesPage.module.scss'
import DedicList from '../../../Components/Services/DedicatedServers/DedicList/DedicList'

export default function DedicatedServersPage() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  // const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const servers = [{ id: { $: '1' } }, { id: { $: '1' } }, { id: { $: '1' } }]

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

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
                  onClick={() => console.log('tools icon clicked')}
                  disabled={false}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper label={t('reload')}>
                <IconButton className={s.tools_icon} disabled={false} icon="reload" />
              </HintWrapper>
              <HintWrapper label={t('ip_addresses')}>
                <IconButton className={s.tools_icon} disabled={false} icon="ip" />
              </HintWrapper>
              <HintWrapper label={t('prolong')}>
                <IconButton className={s.tools_icon} disabled={false} icon="clock" />
              </HintWrapper>
              <HintWrapper label={t('history')}>
                <IconButton className={s.tools_icon} icon="refund" />
              </HintWrapper>
              <HintWrapper label={t('instruction')}>
                <IconButton className={s.tools_icon} disabled={false} icon="info" />
              </HintWrapper>
              <HintWrapper label={t('go_to_panel')}>
                <IconButton className={s.tools_icon} disabled={false} icon="exitSign" />
              </HintWrapper>
            </div>
          )}
        </div>

        <Button
          className={s.order_btn}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' })}
          onClick={() => navigate(route.DEDICATED_SERVERS_ORDER)}
        />
      </div>

      <DedicList
        servers={servers}
        activeServerID={'1'}
        setElidForEditModal={() => null}
        setActiveServer={() => null}
      />

      <Backdrop isOpened={Boolean(false)} onClick={() => console.log('modalclik')}>
        <p>some text</p>
      </Backdrop>
    </>
  )
}
