import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import * as route from '../../../routes'

import s from './NavBar.module.scss'

export default function NavBar() {
  const { t } = useTranslation('affiliate_program')

  return (
    <div className={s.nav_bar}>
      <h2 className={s.title}> {t('page_title')} </h2>
      <div className={s.links_wrapper}>
        <div className={s.scroll_area}>
          <NavLink
            className={({ isActive }) =>
              isActive ? s.active_link + ' ' + s.link : s.link
            }
            to={route.AFFILIATE_PROGRAM_ABOUT}
          >
            {t('about_section_title')}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? s.active_link + ' ' + s.link : s.link
            }
            to={route.AFFILIATE_PROGRAM_INCOME}
          >
            {t('income_section_title')}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? s.active_link + ' ' + s.link : s.link
            }
            to={route.AFFILIATE_PROGRAM_STATISTICS}
          >
            {t('statistics_section_title')}
          </NavLink>
        </div>
        <div className={s.line}></div>
      </div>
    </div>
  )
}
