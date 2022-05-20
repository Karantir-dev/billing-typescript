import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import * as routes from '../../../routes'
import { usePageRender } from '../../../utils'
import ServiceCard from '../ServiceCard/ServiceCard'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import './ServicesList.scss'

SwiperCore.use([EffectCoverflow, Pagination])

export default function ServicesList() {
  const { t } = useTranslation('container')
  const tabletOrLower = useMediaQuery({ query: '(max-width: 1199px)' })
  const laptopAndHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const isDomainsAllowedToRender = usePageRender('mainmenuservice', 'domain')
  const isVdsAllowedToRender = usePageRender('mainmenuservice', 'vds')
  const isDedicactedAllowedToRender = usePageRender('mainmenuservice', 'dedic')
  const isVirtualHostAllowedToRender = usePageRender('mainmenuservice', 'vhost')
  const isDnsAllowedToRender = usePageRender('mainmenuservice', 'dnshost')
  const isFtpAllowedToRender = usePageRender('mainmenuservice', 'storage')
  const isWebsitecareAllowedToRender = usePageRender('mainmenuservice', 'storage')
  // zabota-o-servere !!! this func is not provided in mainmenuservice, needs to be checked
  const isForexServerAllowedToRender = usePageRender('mainmenuservice', 'wuwuwuw')

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.domains'),
      id: 1,
      routeName: routes.HOME,
      allowedToRender: isDomainsAllowedToRender,
      icon_name: 'domains',
      icon_width: '97',
      icon_height: '117',
    },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      id: 2,
      routeName: routes.HOME,
      allowedToRender: isVdsAllowedToRender,
      icon_name: 'vds',
      icon_width: '99',
      icon_height: '115',
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      id: 3,
      routeName: routes.HOME,
      allowedToRender: isDedicactedAllowedToRender,
      icon_name: 'dedicated',
      icon_width: '106',
      icon_height: '154',
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      id: 4,
      routeName: routes.HOME,
      allowedToRender: isVirtualHostAllowedToRender,
      icon_name: 'virtual_hosting',
      icon_width: '118',
      icon_height: '90',
    },
    {
      name: t('burger_menu.services.services_list.dns_hosting'),
      id: 5,
      routeName: routes.HOME,
      allowedToRender: isDnsAllowedToRender,
      icon_name: tabletOrLower ? 'dns_hosting_min' : 'dns_hosting',
      icon_width: '84',
      icon_height: '93',
    },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      id: 6,
      routeName: routes.HOME,
      allowedToRender: isFtpAllowedToRender,
      icon_name: 'ftp_storage',
      icon_width: '111',
      icon_height: '97',
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      id: 7,
      routeName: routes.HOME,
      allowedToRender: isWebsitecareAllowedToRender,
      icon_name: 'care',
      icon_width: '115',
      icon_height: '106',
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      id: 8,
      routeName: routes.HOME,
      allowedToRender: isForexServerAllowedToRender,
      icon_name: 'forexbox',
      icon_width: '109',
      icon_height: '81',
    },
  ]

  const filteredServicesMenuList = servicesMenuList.filter(item => item.allowedToRender)

  return (
    <ul className="swiper_services_list">
      {laptopAndHigher ? (
        filteredServicesMenuList.map((item, index) => {
          const { id, name, routeName, icon_name, icon_height, icon_width } = item

          return (
            <ServiceCard
              key={id}
              title={name.toUpperCase()}
              index={index + 1}
              route={routeName}
              iconName={icon_name}
              className="swiper-item"
              iconWidth={icon_width}
              iconHeight={icon_height}
            />
          )
        })
      ) : (
        <Swiper
          spaceBetween={0}
          slidesPerView={'auto'}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
        >
          {servicesMenuList.map((item, index) => {
            const { id, name, routeName, icon_name, icon_height, icon_width } = item

            return (
              <SwiperSlide key={id}>
                <ServiceCard
                  title={name.toUpperCase()}
                  index={index + 1}
                  route={routeName}
                  iconName={icon_name}
                  className="swiper-item"
                  iconWidth={icon_width}
                  iconHeight={icon_height}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </ul>
  )
}
