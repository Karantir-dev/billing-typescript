import React, { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import BurgerMenu from './BurgerMenu/BurgerMenu'
import { userSelectors, authOperations, selectors } from '../../../Redux'
import { NotificationsBar, ThemeBtn, LangBtn } from '../../../Components'
import { Logo, FilledEnvelope, Bell, Profile, Shevron } from '../../../images'
import * as routes from '../../../routes'

import s from './Header.module.scss'
import { useOutsideAlerter, usePageRender } from '../../../utils'

export default function Header() {
  const { t } = useTranslation('container')
  const dispatch = useDispatch()

  const isEnvelopeAllowedToRender = usePageRender('support', 'clientticket')
  const isBellAllowedToRender = usePageRender('support', 'notification')
  const isTrustedUsersAllowedToRender = usePageRender('customer', 'user')

  const areUserSettingsAllowedToRender = usePageRender('customer', 'usrparam')

  const isAuthLogAllowedToRender = usePageRender('stat', 'authlog')

  const arePayersAllowedToRender = usePageRender('customer', 'profile')

  const profileMenuList = [
    {
      name: t('profile.user_settings'),
      routeName: routes.USER_SETTINGS,
      allowedToRender: areUserSettingsAllowedToRender,
    },
    {
      name: t('profile.trusted_users'),
      routeName: routes.TRUSTED_USERS,
      allowedToRender: isTrustedUsersAllowedToRender,
    },
    {
      name: t('profile.visiting_log'),
      routeName: routes.ACCESS_LOG,
      allowedToRender: isAuthLogAllowedToRender,
    },
    {
      name: t('profile.payers'),
      routeName: routes.PAYERS,
      allowedToRender: arePayersAllowedToRender,
    },
    {
      name: t('profile.contracts'),
      routeName: routes.CONTRACTS,
      allowedToRender: true,
    },
  ]

  const profileMenuListToRender = profileMenuList.filter(item => item.allowedToRender)

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const messages = useSelector(userSelectors.getUserItems)

  const mesAmount = messages.bitem
    ? Array.isArray(messages.bitem) && messages.bitem !== 'undefined'
      ? messages.bitem.length
      : 1
    : 0

  const [notifications, setNotifications] = useState(mesAmount)

  const handleRemoveNotif = () => {
    let newNotifications = notifications === 0 ? 0 : notifications - 1
    setNotifications(newNotifications)
  }

  const userTickets = useSelector(userSelectors.getUserTickets)
  const areNewTickets = userTickets.some(ticket => ticket.tstatus.$ === 'New replies')

  const { $balance, $realname, $email } = useSelector(userSelectors.getUserInfo)

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
            <Link to={routes.SERVICES} className={s.logo}>
              <Logo svgwidth="93" svgheight="41" />
            </Link>

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
                      {t('balance')}{' '}
                      <span className={s.balance_sum}>
                        {$balance && Number($balance)?.toFixed(2)} EUR
                      </span>
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
                {isEnvelopeAllowedToRender && (
                  <li
                    className={cn({
                      [s.item]: true,
                      [s.active_notification]: areNewTickets,
                    })}
                  >
                    <NavLink
                      to={routes.SUPPORT}
                      className={({ isActive }) =>
                        cn(s.link, {
                          [s.active]: isActive,
                        })
                      }
                    >
                      <FilledEnvelope svgwidth="21" svgheight="16" className={s.icon} />
                    </NavLink>
                  </li>
                )}

                {isBellAllowedToRender && (
                  <li
                    className={cn({
                      [s.item]: true,
                      [s.item_bell]: true,
                      [s.notification_messages]: notifications > 0,
                    })}
                  >
                    <button onClick={handleBellClick} className={s.btn}>
                      <Bell
                        svgheight="22"
                        svgwidth="18"
                        className={cn({ [s.icon]: true, [s.bell]: true })}
                      />
                      {notifications > 0 && (
                        <div className={s.notification_counter_wrapper}>
                          <p className={s.notification_messages_counter}>
                            {notifications}
                          </p>
                        </div>
                      )}
                    </button>
                  </li>
                )}

                <li className={cn({ [s.item]: true, [s.profile_item]: true })}>
                  <button
                    className={s.profile_btn}
                    onClick={() => setIsProfileOpened(!isProfileOpened)}
                  >
                    <Profile svgheight="23" svgwidth="23" className={s.icon} />
                    <Shevron
                      className={cn({
                        [s.arrow_icon]: true,
                        [s.active]: isProfileOpened,
                      })}
                    />
                  </button>

                  <ul
                    className={cn({
                      [darkTheme ? s.profile_list_dt : s.profile_list_lt]: true,
                      [s.opened]: isProfileOpened,
                    })}
                    ref={getProfileEl}
                  >
                    <li className={s.profile_list_username_item}>
                      <div>
                        <p className={s.user_name}>{$realname}</p>
                        <p
                          className={cn({
                            [s.user_email]: true,
                            [s.user_email_lt]: !darkTheme,
                          })}
                        >
                          {$email}
                        </p>
                      </div>
                    </li>

                    {profileMenuListToRender.map(item => {
                      return (
                        <li key={nanoid()} className={s.profile_list_item}>
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={() => {}}
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
                        onKeyDown={() => {}}
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
        countNotification={notifications}
        removedNotification={handleRemoveNotif}
        isBarOpened={isNotificationBarOpened}
        handler={handleBellClick}
      />
    </>
  )
}
