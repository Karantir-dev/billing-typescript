import React from 'react'
import { useTranslation } from 'react-i18next'
import { Bell } from '../../../images'
import * as routes from '../../../routes'
import ServiceCard from '../ServiceCard/ServiceCard'
// import { useTranslation } from 'react-i18next'
// import { useSelector } from 'react-redux'

// import { selectors } from '../../Redux'

import s from './ServicesList.module.scss'

export default function ServicesList() {
  const { t } = useTranslation('container')

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.domains'),
      id: 1,
      routeName: routes.HOME,
      allowedToRender: true,
      icon: <Bell className={s.icon} svgwidth="40" svgheight="40" />,
    },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      id: 2,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      id: 3,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      id: 4,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.dns_hosting'),
      id: 5,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      id: 6,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      id: 7,
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      id: 8,
      routeName: routes.HOME,
      allowedToRender: true,
    },
  ]

  return (
    <div className={s.wrapper}>
      <ul className={s.list}>
        {servicesMenuList.map(item => {
          const { id, name, routeName, allowedToRender, icon } = item

          return (
            <ServiceCard
              key={id}
              title={name}
              route={routeName}
              allowedToRender={allowedToRender}
              icon={icon}
            />
          )
        })}
      </ul>
    </div>
  )
}
