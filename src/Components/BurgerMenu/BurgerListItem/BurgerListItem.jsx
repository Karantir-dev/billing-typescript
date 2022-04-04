import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { nanoid } from 'nanoid'

import { selectors } from '../../../Redux/selectors'
import s from './BurgerListItem.module.scss'

export default function BurgerListItem({
  svg,
  name,
  isProfile,
  email,
  subList,
  isListOpened,
  arrow,
}) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <>
      <div className={cn({ [s.list_item_container]: true, [s.opened]: isListOpened })}>
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
        onKeyDown={() => null}
        onClick={e => e.stopPropagation()}
      >
        <ul
          className={cn({
            [s.list]: true,
            [s.closed]: isListOpened,
          })}
        >
          {subList.map(item => {
            return (
              <li key={nanoid()} className={s.list_item}>
                <NavLink to={item.routeName}>
                  <p className={s.list_item_name}>{item.name}</p>
                </NavLink>
              </li>
            )
          })}
        </ul>
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
}
