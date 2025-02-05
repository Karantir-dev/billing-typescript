import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import * as routes from '@src/routes'
import { checkIfTokenAlive, usePageRender } from '@utils'
import { useSelector, useDispatch } from 'react-redux'
import { selectors, vhostSelectors } from '@redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination } from 'swiper'
import { ServiceCard, ServiceCardDesktop } from '@components'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import './ServicesList.scss'

SwiperCore.use([Pagination])

export default function ServicesList() {
  const { t } = useTranslation('container')
  const laptopAndHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const dispatch = useDispatch()

  const swiperEl = useRef(null)
  const isWordpressAllowed = useSelector(vhostSelectors.isWordpressAllowed)

  const isDomainsAllowedToRender = usePageRender('mainmenuservice', 'domain', false, 4)
  const isVdsAllowedToRender = usePageRender('mainmenuservice', 'vds', false, 6)
  const isDedicactedAllowedToRender = usePageRender('mainmenuservice', 'dedic', false, 20)
  const isVirtualHostAllowedToRender = usePageRender(
    'mainmenuservice',
    'vhost',
    false,
    23,
  )
  const isDnsAllowedToRender = usePageRender('mainmenuservice', 'dnshost', false, 41)
  const isFtpAllowedToRender = usePageRender('mainmenuservice', 'storage', false, 27090)
  const isWebsitecareAllowedToRender = usePageRender(
    'mainmenuservice',
    'zabota-o-servere',
    false,
    27129,
  )

  const isForexServerAllowedToRender = usePageRender(
    'mainmenuservice',
    'forexbox',
    false,
    27136,
  )

  const isVPNAllowedToRender = usePageRender('mainmenuservice', 'vpn', false, 27140)

  const darkTheme = useSelector(selectors.getTheme)
  const [dark, setDark] = useState(darkTheme)
  // const [clickedSlider, setClickedSlider] = useState(0)

  let dnsPicture = 'dns_hosting'
  let domainsPicture = dark ? 'domains' : 'domains_lt'

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.cloud_vps'),
      id: 11,
      routeName: routes.CLOUD_VPS,
      allowedToRender: true,
      icon_name: 'cloud_vps',
      // icon_width: '131',
      // icon_height: '100',
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
      name: t('burger_menu.services.services_list.dedicated_servers'),
      id: 3,
      routeName: routes.DEDICATED_SERVERS,
      allowedToRender: isDedicactedAllowedToRender,
      icon_name: 'dedicated',
      icon_width: '106',
      icon_height: '154',
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
    {
      name: t('burger_menu.services.services_list.wordpress_hosting'),
      id: 10,
      routeName: routes.WORDPRESS,
      allowedToRender: isVirtualHostAllowedToRender && isWordpressAllowed,
      icon_name: 'wordpress',
      icon_width: '131',
      icon_height: '100',
    },
    {
      name: t('burger_menu.services.services_list.domains'),
      id: 1,
      routeName: routes.DOMAINS,
      allowedToRender: isDomainsAllowedToRender,
      icon_name: domainsPicture,
      icon_width: '97',
      icon_height: '117',
    },

    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      id: 2,
      routeName: routes.VPS,
      allowedToRender: isVdsAllowedToRender,
      icon_name: 'vds',
      icon_width: '99',
      icon_height: '115',
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
      name: t('burger_menu.services.services_list.dns_hosting'),
      id: 5,
      routeName: routes.DNS,
      allowedToRender: isDnsAllowedToRender,
      icon_name: dnsPicture,
      icon_width: '84',
      icon_height: '93',
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
      name: t('VPN'),
      id: 9,
      routeName: routes.VPN,
      allowedToRender: isVPNAllowedToRender,
      icon_name: 'vpn',
      icon_width: '106',
      icon_height: '130',
    },
  ]

  const filteredServicesMenuList = servicesMenuList.filter(item => item.allowedToRender)

  useEffect(() => {
    setDark(!dark)
  }, [darkTheme])

  useEffect(() => {
    if (!laptopAndHigher) {
      try {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.remove('notInViewport')
              } else {
                entry.target.classList.add('notInViewport')
              }
            })
          },
          { root: swiperEl.current, threshold: 1 },
        )

        const slides = swiperEl.current?.querySelectorAll('[data-service-card]')

        slides?.forEach(slide => {
          observer.observe(slide)
        })
      } catch (e) {
        checkIfTokenAlive(e?.message, dispatch)
      }
    }
  }, [])

  return (
    isWordpressAllowed !== null &&
    (laptopAndHigher ? (
      <ul className="services_list">
        {filteredServicesMenuList.map((item, index) => {
          const { id, name, routeName, icon_name, icon_height, icon_width } = item

          return (
            <ServiceCardDesktop
              className="swiper-item"
              key={id}
              title={name.toUpperCase()}
              index={index + 1}
              route={routeName}
              iconName={icon_name}
              iconWidth={icon_width}
              iconHeight={icon_height}
            />
          )
        })}
      </ul>
    ) : (
      <div className="services_swiper_wrapper">
        <Swiper
          className="services_swiper"
          ref={swiperEl}
          slidesPerView={'auto'}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 4,
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
                  iconWidth={icon_width}
                  iconHeight={icon_height}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    ))
  )
}
