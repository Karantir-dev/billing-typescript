import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { selectors } from '../../Redux/selectors'

import { BurgerMenu } from '../../Components'
// import Icon from '../Icon/Icon'
import { Logo, FilledEnvelope, Bell } from '../../images'
import * as routes from '../../routes'

import s from './Header.module.scss'

export default function Header() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  // const userInfo = useSelector(selectors.getUserInfo)
  // const userItems = useSelector(selectors.getUserItems)
  const userTickets = useSelector(selectors.getUserTickets)
  console.log(userTickets)

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return (
    <>
      <header className={s.main_header}>
        <Logo
          className={cn({ [s.logo]: true, [s.pinned_logo]: true })}
          darktheme={darkTheme ? 1 : 0}
        />

        <nav className={s.main_nav}>
          <ul className={s.list}>
            <li className={cn({ [s.item]: true, [s.active_notification]: userTickets })}>
              <NavLink to={routes.HOME} className={s.link}>
                <FilledEnvelope className={s.icon} />
              </NavLink>
            </li>

            <li>
              <NavLink to={routes.HOME} className={s.link}>
                <Bell className={s.icon} />
              </NavLink>
            </li>

            <li>
              <button
                className={cn({
                  [s.header_menuburger]: true,
                  [s.hamburger_spin]: true,
                  [s.opened]: isMenuOpened,
                })}
                type="button"
                onClick={handleClick}
              >
                <span className={s.hamburger_box}>
                  <span className={s.hamburger_inner}></span>
                </span>
              </button>
            </li>
          </ul>
        </nav>
        <button className={s.button}></button>
      </header>

      <BurgerMenu
        isOpened={isMenuOpened}
        classes={cn({ [s.burger_menu]: true, [s.opened]: isMenuOpened })}
      />
    </>
  )
}
