import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import { Logo, Pin, Box, Wallet, Social, Support } from './../../images'
import * as routes from '../../routes'

import s from './AsideServicesMenu.module.scss'
import { actions } from '../../Redux/actions'

const AsideServicesMenu = () => {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const pinnedStatus = useSelector(selectors.getIsPinned)

  const dispatch = useDispatch()
  console.log('pinnedStatus', pinnedStatus)

  const { t } = useTranslation('main')

  const handleClick = () => {
    dispatch(actions.changeIsPinned())
  }

  return (
    <nav className={cn({ [s.navigation]: true, [s.navigation_pinned]: !pinnedStatus })}>
      <ul className={s.list}>
        <Logo
          className={cn({ [s.logo]: true, [s.pinned_logo]: !pinnedStatus })}
          darktheme={darkTheme ? 1 : 0}
        />
        <li className={s.item}>
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: pinnedStatus ? '0px' : '23px',
            }}
          >
            <Box className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.services')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: pinnedStatus ? '0px' : '23px',
            }}
          >
            <Wallet className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.finance_and_docs')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.REGISTRATION}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: pinnedStatus ? '0px' : '23px',
            }}
          >
            <Social className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.referal_program')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: pinnedStatus ? '0px' : '23px',
            }}
          >
            <Support className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.support')}</p>}
          </NavLink>
        </li>
      </ul>

      <button
        className={cn({ [s.pin_wrapper]: true, [s.transformed]: !pinnedStatus })}
        onClick={handleClick}
      >
        <Pin className={s.pin_icon} />
      </button>
    </nav>
  )
}

export default AsideServicesMenu
