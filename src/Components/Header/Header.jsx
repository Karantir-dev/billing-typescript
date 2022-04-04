import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import { userOperations } from '../../Redux/userInfo/userOperations'
import { authSelectors } from '../../Redux/auth/authSelectors'
import { selectors } from '../../Redux/selectors'
import { userSelectors } from '../../Redux/userInfo/userSelectors'
import { BurgerMenu } from '../../Components'
import { Logo, FilledEnvelope, Bell } from '../../images'
import * as routes from '../../routes'

import s from './Header.module.scss'

export default function Header() {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(userOperations.getUserInfo(isAuthenticated))
      dispatch(userOperations.getItems(isAuthenticated))
      dispatch(userOperations.getTickets(isAuthenticated))
    }
  }, [])

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const messages = useSelector(userSelectors.getUserItems)

  const mes = messages.msg.$
  const notifications = messages.bitem
  console.log(notifications)

  const userTickets = useSelector(userSelectors.getUserTickets)
  const areNewTickets = userTickets.some(ticket => ticket.tstatus.$ === 'New replies')
  console.log(userTickets)

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return (
    <>
      <header className={s.main_header}>
        <Logo className={s.logo} darktheme={darkTheme ? 1 : 0} />

        <nav className={s.main_nav}>
          <ul className={s.list}>
            <li
              className={cn({
                [s.item]: true,
                [s.active_notification]: areNewTickets,
              })}
            >
              <NavLink to={routes.HOME} className={s.link}>
                <FilledEnvelope className={s.icon} />
              </NavLink>
            </li>

            <li
              className={cn({
                [s.item]: true,
                [s.notification_messages]: messages > 0,
              })}
            >
              <NavLink to={routes.HOME} className={s.link}>
                <Bell className={s.icon} />
                {mes > 0 && (
                  <span className={s.notification_messages_counter}>{mes}</span>
                )}
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
      </header>

      <BurgerMenu
        isOpened={isMenuOpened}
        classes={cn({ [s.burger_menu]: true, [s.opened]: isMenuOpened })}
      />
    </>
  )
}
