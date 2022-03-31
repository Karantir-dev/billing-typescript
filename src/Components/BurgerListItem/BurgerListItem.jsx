import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'

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
  return (
    <>
      <div className={cn({ [s.list_item_container]: true, [s.opened]: isListOpened })}>
        {svg}
        {isProfile ? (
          <div className={s.profile_wrapper}>
            <p className={s.user_name}>{name}</p>
            <p className={s.email}>{email}</p>
          </div>
        ) : (
          <p className={s.list_name}>{name}</p>
        )}
        {arrow}
      </div>
      <ul
        className={cn({
          [s.list]: true,
          [s.closed]: isListOpened,
        })}
      >
        {subList.map(item => {
          return (
            <li key={uuidv4()} className={s.list_item}>
              <NavLink to={item.routeName}>
                <p className={s.list_item_name}>{item.name}</p>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </>
  )
}

BurgerListItem.propTypes = {
  name: PropTypes.string.isRequired,
  subList: PropTypes.array,
  svg: PropTypes.object,
  email: PropTypes.string,
  isProfile: PropTypes.bool,
}
