import React from 'react'
import { NavLink } from 'react-router-dom'
import cn from 'classnames'
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
              className={({ isActive }) => cn(s.link, { [s.active_link]: isActive })}
              to={route}
            >
              {label}
            </NavLink>
          )
        })}
      </div>
      <div className={s.blur} />
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
