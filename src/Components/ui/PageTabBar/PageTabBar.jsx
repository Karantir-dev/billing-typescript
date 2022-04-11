import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import s from './PageTabBar.module.scss'

export default function Component({ sections }) {
  return (
    <div className={s.nav_bar}>
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
    </div>
  )
}

Component.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
}
