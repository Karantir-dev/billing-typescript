import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import { Logo, Pin, Box, Wallet, Social, Support } from './../../images'
import * as routes from '../../routes'

import s from './AsideServicesMenu.module.scss'

const AsideServicesMenu = () => {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const [isPinned, setIsPinned] = useState(true)
  const { t } = useTranslation('main')

  const handleClick = e => {
    e.preventDefault()
    setIsPinned(!isPinned)

    isPinned
      ? localStorage.setItem('pinned-menu', 'false')
      : localStorage.setItem('pinned-menu', 'true')
  }

  useEffect(() => {
    const isStoraged = localStorage.getItem('pinned-menu')
    isStoraged === 'true' ? setIsPinned(true) : setIsPinned(false)
  }, [])

  return (
    <nav className={cn({ [s.navigation]: true, [s.navigation_pinned]: !isPinned })}>
      <ul className={s.list}>
        <Logo
          className={cn({ [s.logo]: true, [s.pinned_logo]: !isPinned })}
          darktheme={darkTheme ? 1 : 0}
        />
        <li className={s.item}>
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: isPinned ? '0px' : '23px',
            }}
          >
            <Box className={s.img} />
            {isPinned && <p className={s.text}>{t('aside_menu.services')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: isPinned ? '0px' : '23px',
            }}
          >
            <Wallet className={s.img} />
            {isPinned && <p className={s.text}>{t('aside_menu.finance_and_docs')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.REGISTRATION}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: isPinned ? '0px' : '23px',
            }}
          >
            <Social className={s.img} />
            {isPinned && <p className={s.text}>{t('aside_menu.referal_program')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: isPinned ? '0px' : '23px',
            }}
          >
            <Support className={s.img} />
            {isPinned && <p className={s.text}>{t('aside_menu.support')}</p>}
          </NavLink>
        </li>
      </ul>

      <button
        className={cn({ [s.pin_wrapper]: true, [s.transformed]: !isPinned })}
        onClick={handleClick}
      >
        <Pin className={s.pin_icon} />
      </button>
    </nav>
  )
}

export default AsideServicesMenu
