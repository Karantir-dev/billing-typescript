import React, { useState, useEffect } from 'react'
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
import { useSelector } from 'react-redux'
import { selectors } from '../../../Redux'

SwiperCore.use([EffectCoverflow, Pagination])

export default function ServicesList() {
  const { t } = useTranslation('container')
  const tabletOrLower = useMediaQuery({ query: '(max-width: 1199px)' })
  const laptopAndHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const isDomainsAllowedToRender = usePageRender('mainmenuservice', 'domain', false)
  const isVdsAllowedToRender = usePageRender('mainmenuservice', 'vds', false)
  const isDedicactedAllowedToRender = usePageRender('mainmenuservice', 'dedic', false)
  const isVirtualHostAllowedToRender = usePageRender('mainmenuservice', 'vhost', false)
  const isDnsAllowedToRender = usePageRender('mainmenuservice', 'dnshost', false)
  const isFtpAllowedToRender = usePageRender('mainmenuservice', 'storage', false)
  const isWebsitecareAllowedToRender = usePageRender(
    'mainmenuservice',
    'zabota-o-servere',
    false,
  )
  // zabota-o-servere !!! this func is not provided in mainmenuservice, needs to be checked
  const isForexServerAllowedToRender = usePageRender('mainmenuservice', 'forexbox', false) //funcname wuwuwuw

  const darkTheme = useSelector(selectors.getTheme)
  const [dark, setDark] = useState(darkTheme)

  let dnsPicture = dark ? 'dns_hosting_lt' : 'dns_hosting'

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.domains'),
      id: 1,
      routeName: routes.DOMAINS,
      allowedToRender: isDomainsAllowedToRender,
      icon_name: 'domains',
      icon_width: '97',
      icon_height: '117',
    },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      id: 2,
      routeName: routes.VDS,
      allowedToRender: isVdsAllowedToRender,
      icon_name: 'vds',
      icon_width: '99',
      icon_height: '115',
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      id: 3,
      routeName: routes.DEDICATED_SERVERS,
      allowedToRender: isDedicactedAllowedToRender,
      icon_name: 'dedicated',
      icon_width: '106',
      icon_height: '154',
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      id: 4,
      routeName: routes.SHARED_HOSTING,
      allowedToRender: isVirtualHostAllowedToRender,
      icon_name: 'virtual_hosting',
      icon_width: '118',
      icon_height: '90',
    },
    {
      name: t('burger_menu.services.services_list.dns_hosting'),
      id: 5,
      routeName: routes.DNS,
      allowedToRender: isDnsAllowedToRender,
      icon_name: tabletOrLower ? 'dns_hosting_min' : dnsPicture,
      icon_width: '84',
      icon_height: '93',
    },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      id: 6,
      routeName: routes.FTP,
      allowedToRender: isFtpAllowedToRender,
      icon_name: 'ftp_storage',
      icon_width: '111',
      icon_height: '97',
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      id: 7,
      routeName: routes.SITE_CARE,
      allowedToRender: isWebsitecareAllowedToRender,
      icon_name: 'care',
      icon_width: '115',
      icon_height: '106',
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      id: 8,
      routeName: routes.FOREX,
      allowedToRender: isForexServerAllowedToRender,
      icon_name: 'forexbox',
      icon_width: '109',
      icon_height: '81',
    },
  ]

  const filteredServicesMenuList = servicesMenuList.filter(item => item.allowedToRender)

  useEffect(() => {
    setDark(!dark)
  }, [darkTheme])

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
          {filteredServicesMenuList.map((item, index) => {
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
