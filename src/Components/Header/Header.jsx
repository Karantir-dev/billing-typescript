import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { userOperations } from '../../Redux/userInfo/userOperations'
import { authSelectors } from '../../Redux/auth/authSelectors'
import { selectors } from '../../Redux/selectors'
import { userSelectors } from '../../Redux/userInfo/userSelectors'
import { BurgerMenu, NotificationsBar, ThemeBtn, LangBtn } from '../../Components'
import { Logo, FilledEnvelope, Bell, Profile, Shevron } from '../../images'
import * as routes from '../../routes'

import s from './Header.module.scss'
import { authOperations } from '../../Redux/auth/authOperations'
import { useOutsideAlerter } from '../../utils'

export default function Header() {
  const { t } = useTranslation('main')
  const profileMenuList = [
    { name: t('profile.user_settings'), routeName: routes.HOME },
    { name: t('profile.trusted_users'), routeName: routes.TRUSTED_USERS },
    { name: t('profile.visiting_log'), routeName: routes.ACCESS_LOG },
    { name: t('profile.activity_log'), routeName: routes.HOME },
    { name: t('profile.contracts'), routeName: routes.HOME },
  ]

  const sessionId = useSelector(authSelectors.getSessionId)
  const [removeNotification, setRemoveNotification] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userOperations.getUserInfo(sessionId))
  }, [removeNotification])

  const handleRemoveNotif = () => {
    setRemoveNotification(!removeNotification)
  }

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const messages = useSelector(userSelectors.getUserItems)

  const mesAmount = messages.bitem
    ? Array.isArray(messages.bitem) && messages.bitem !== 'undefined'
      ? messages.bitem.length
      : 1
    : 0

  const userTickets = useSelector(userSelectors.getUserTickets)
  const areNewTickets = userTickets.some(ticket => ticket.tstatus.$ === 'New replies')

  const { $balance } = useSelector(userSelectors.getUserInfo)

  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [isNotificationBarOpened, setIsNotificationBarOpened] = useState(false)
  const [isProfileOpened, setIsProfileOpened] = useState(false)
  const getProfileEl = useRef()

  const clickOutside = () => {
    setIsProfileOpened(!isProfileOpened)
  }

  useOutsideAlerter(getProfileEl, isProfileOpened, clickOutside)

  const handleBellClick = () => {
    setIsNotificationBarOpened(!isNotificationBarOpened)
  }
  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  const logOut = () => {
    dispatch(authOperations.logout())
  }

  return (
    <>
      <header className={s.main_header}>
        <div className={s.container}>
          <div className={s.header}>
            <Logo className={s.logo} />

            <nav className={s.main_nav}>
              <ul className={s.list}>
                <li
                  className={cn({
                    [s.item]: true,
                    [s.balance_item]: true,
                  })}
                >
                  <div className={s.balance_wrapper}>
                    <p className={s.balance_text}>
                      {t('balance')} <span className={s.balance_sum}>{$balance} EUR</span>
                    </p>
                  </div>
                </li>
                <li
                  className={cn({
                    [s.item]: true,
                    [s.theme_item]: true,
                  })}
                >
                  <ThemeBtn mainType={true} />
                </li>
                <li
                  className={cn({
                    [s.item]: true,
                    [s.lang_item]: true,
                  })}
                >
                  <LangBtn mainType={true} />
                </li>
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
                    [s.item_bell]: true,
                    [s.notification_messages]: mesAmount > 0,
                  })}
                >
                  <button onClick={handleBellClick}>
                    <Bell className={s.icon} />
                    {mesAmount > 0 && (
                      <span className={s.notification_messages_counter}>{mesAmount}</span>
                    )}
                  </button>
                </li>
                <li className={cn({ [s.item]: true, [s.profile_item]: true })}>
                  <button
                    className={s.profile_btn}
                    onClick={() => setIsProfileOpened(!isProfileOpened)}
                  >
                    <Profile className={s.icon} />
                    <Shevron
                      className={cn({
                        [s.arrow_icon]: true,
                        [s.active]: isProfileOpened,
                      })}
                    />
                  </button>

                  <ul
                    className={cn({
                      [s.profile_list]: true,
                      [darkTheme ? s.profile_list_dt : s.profile_list_lt]: true,
                      [s.opened]: isProfileOpened,
                    })}
                    ref={getProfileEl}
                  >
                    {profileMenuList.map(item => {
                      return (
                        <li key={nanoid()} className={s.profile_list_item}>
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={() => null}
                            onClick={() => setIsProfileOpened(!isProfileOpened)}
                          >
                            <NavLink to={item.routeName}>
                              <p className={s.list_item_name}>{item.name}</p>
                            </NavLink>
                          </div>
                        </li>
                      )
                    })}
                    <li className={s.exit_list_item}>
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => null}
                        onClick={logOut}
                      >
                        <NavLink to={routes.LOGIN}>
                          <p className={s.exit_name}>{t('profile.log_out')}</p>
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
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
      <BurgerMenu
        isOpened={isMenuOpened}
        classes={cn({ [s.burger_menu]: true, [s.opened]: isMenuOpened })}
        controlMenu={handleClick}
      />

      <NotificationsBar
        removedNotification={handleRemoveNotif}
        isBarOpened={isNotificationBarOpened}
        handler={handleBellClick}
      />
    </>
  )
}
