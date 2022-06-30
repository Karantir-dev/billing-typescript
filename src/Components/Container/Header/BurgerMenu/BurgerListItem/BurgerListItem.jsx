import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { nanoid } from 'nanoid'

import { selectors } from '../../../../../Redux'

import { CSSTransition } from 'react-transition-group'
import animations from './animations.module.scss'
import s from './BurgerListItem.module.scss'

export default function BurgerListItem({
  svg,
  name,
  isProfile,
  email,
  subList,
  isListOpened,
  arrow,
  controlMenu,
}) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <>
      <div
        className={cn({
          [s.list_item_container]: true,
          [s.opened]: isListOpened,
        })}
      >
        {svg}
        {isProfile ? (
          <div className={s.profile_wrapper}>
            <p className={s.user_name}>{name}</p>
            <p className={cn({ [s.email]: true, [s.email_lt]: !darkTheme })}>{email}</p>
          </div>
        ) : (
          <p className={s.list_name}>{name}</p>
        )}
        {arrow}
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={e => e.stopPropagation()}
      >
        <CSSTransition
          in={isListOpened}
          classNames={animations}
          timeout={150}
          unmountOnExit
        >
          <ul
            className={cn({
              [s.list]: true,
              [s.closed]: isListOpened,
            })}
          >
            {subList.map(item => {
              if (item.allowedToRender) {
                return (
                  <li key={nanoid()} className={s.list_item}>
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={controlMenu}
                    >
                      <NavLink to={item.routeName}>
                        <p className={s.list_item_name}>{item.name}</p>
                      </NavLink>
                    </div>
                  </li>
                )
              } else {
                return null
              }
            })}
          </ul>
        </CSSTransition>
      </div>
    </>
  )
}

BurgerListItem.propTypes = {
  name: PropTypes.string,
  subList: PropTypes.array,
  svg: PropTypes.object,
  email: PropTypes.string,
  isProfile: PropTypes.bool,
  isListOpened: PropTypes.bool,
  arrow: PropTypes.object,
}
