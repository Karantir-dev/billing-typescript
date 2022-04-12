import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import s from './NavBar.module.scss'

export default function NavBar({ sections }) {
  const { t } = useTranslation('affiliate_program')

  return (
    <div className={s.nav_bar}>
      <h2 className={s.title}> {t('page_title')} </h2>
      <div className={s.links_wrapper}>
        <div className={s.scroll_area}>
          {sections.map(({ route, label }) => {
            return (
              <NavLink
                key={route}
                className={({ isActive }) =>
                  isActive ? s.active_link + ' ' + s.link : s.link
                }
                to={route}
              >
                {label}
              </NavLink>
            )
          })}
        </div>
        <div className={s.line}></div>
      </div>
    </div>
  )
}

NavBar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
}
