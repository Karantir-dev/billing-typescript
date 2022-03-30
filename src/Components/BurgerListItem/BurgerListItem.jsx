import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

import * as routes from '../../routes'

import s from './BurgerListItem.module.scss'
import cn from 'classnames'

export default function BurgerListItem({ svg, name, isProfile, email, subList }) {
  const [isListOpened, setIsListOpened] = useState(false)

  const handleClick = () => {
    setIsListOpened(!isListOpened)
  }

  return (
    <>
      <div className={s.list_item_container}>
        <img src={svg} alt="calendar-icon" className={s.svg_icon} />
        {isProfile ? (
          <div className={s.profile_wrapper}>
            <p className={s.list_name}>{name}</p>
            <p className={s.email}>{email}</p>
          </div>
        ) : (
          <p className={s.list_name}>{name}</p>
        )}

        <span className={s.show_hide_icon} onClick={handleClick}>
          &lt;
        </span>
      </div>
      <ul className={cn({ [s.list]: true, [s.closed]: isListOpened })}>
        {subList.map(item => {
          return (
            <li key={uuidv4()} className={s.list_item}>
              <NavLink to={item.routeName}>{item.name}</NavLink>
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
  svg: PropTypes.string,
  email: PropTypes.string,
  isProfile: PropTypes.bool,
}
