import { NavLink } from 'react-router-dom'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './PageTabBar.module.scss'
import { Fragment } from 'react'

export default function PageTabBar({ sections, activeValue }) {
  const sectionsToRender = sections.filter(item => item.allowToRender)

  return (
    <div className={s.nav_bar}>
      <div className={s.blur}>
        <div className={s.scroll_area}>
          {sectionsToRender.map(
            ({ route, label, replace, end, localValue, onLocalClick }) => {
              return (
                <Fragment key={label}>
                  {localValue ? (
                    <button
                      className={cn(s.link, {
                        [s.active_link]: activeValue === localValue,
                      })}
                      onClick={onLocalClick}
                      type="button"
                    >
                      {label}
                    </button>
                  ) : (
                    <NavLink
                      key={route}
                      className={({ isActive }) =>
                        cn(s.link, { [s.active_link]: isActive })
                      }
                      to={route}
                      replace={replace}
                      end={end}
                    >
                      {label}
                    </NavLink>
                  )}
                </Fragment>
              )
            },
          )}
        </div>
      </div>
    </div>
  )
}

PageTabBar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
}
