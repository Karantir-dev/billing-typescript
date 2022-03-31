import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'

import { BurgerMenu } from '../../Components'
import Icon from '../Icon/Icon'
import * as routes from '../../routes'

import s from './Header.module.scss'
import { Logo } from '../../images'

export default function Header() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  // const userInfo = useSelector(selectors.getUserInfo)
  // const userItems = useSelector(selectors.getUserItems)
  // const userTickets = useSelector(selectors.getUserTickets)

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return (
    <>
      <header className={s.main_header}>
        <Logo
          className={cn({ [s.logo]: true, [s.pinned_logo]: !isPinned })}
          darktheme={darkTheme ? 1 : 0}
        />

        <nav className={s.main_nav}>
          <ul className={s.list}>
            <li className={s.item}>
              <NavLink to={routes.HOME} className={s.link}>
                <Icon
                  className={s.icon}
                  name="filled-envelope"
                  width={24}
                  height={18}
                  isGradient={false}
                />
              </NavLink>
            </li>

            <li className={s.item}>
              <NavLink to={routes.HOME} className={s.link}>
                <Icon
                  className={s.icon}
                  name="bell"
                  width={20}
                  height={24}
                  isGradient={false}
                />
              </NavLink>
            </li>

            <li className={s.item}>
              <button onClick={handleClick}>
                {isMenuOpened ? (
                  <button className={s.close_burger_btn}>X</button>
                ) : (
                  <Icon
                    className={s.burger_icon}
                    name="burger"
                    width={24}
                    height={18}
                    isGradient={false}
                  />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </header>
      {isMenuOpened && <BurgerMenu />}
    </>
  )
}
