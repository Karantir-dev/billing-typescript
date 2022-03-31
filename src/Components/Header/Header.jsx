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
  // console.log(userItems)
  // const userTickets = useSelector(selectors.getUserTickets)

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
            <li className={s.item}>
              <NavLink to={routes.HOME} className={s.link}>
                <FilledEnvelope className={s.icon} />
              </NavLink>
            </li>

            <li className={s.item}>
              <NavLink to={routes.HOME} className={s.link}>
                <Bell className={s.icon} />
              </NavLink>
            </li>

            <li className={s.item}>
              <button onClick={handleClick}>
                <button
                  className={cn({
                    [s.header_menuburger]: true,
                    [s.hamburger_spin]: true,
                    [s.opened]: isMenuOpened,
                  })}
                  type="button"
                >
                  <span className={s.hamburger_box}>
                    <span className={s.hamburger_inner}></span>
                  </span>
                </button>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <BurgerMenu classes={cn({ [s.burger_menu]: true, [s.opened]: isMenuOpened })} />
    </>
  )
}
