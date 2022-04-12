import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '../../../Redux/selectors'
import { Logo, Pin, Box, Wallet, Social, Support } from './../../../images'
import * as routes from '../../../routes'

import s from './AsideServicesMenu.module.scss'
import { actions } from '../../../Redux/actions'

const AsideServicesMenu = () => {
  const pinnedStatus = useSelector(selectors.getIsPinned)
  const tabletOrHigher = useMediaQuery({ query: '(max-width: 1023px)' })

  const dispatch = useDispatch()

  const { t } = useTranslation('main')

  const pinnedStyle = {
    paddingBottom: pinnedStatus ? '0px' : '23px',
  }

  const handleClick = () => {
    dispatch(actions.changeIsPinned())
  }

  if (tabletOrHigher) {
    return null
  }

  return (
    <nav className={cn({ [s.navigation]: true, [s.navigation_pinned]: !pinnedStatus })}>
      <ul className={s.list}>
        <Logo className={cn({ [s.logo]: true, [s.pinned_logo]: !pinnedStatus })} />
        <li className={s.item}>
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? s.active : s.inactive)}
            style={pinnedStyle}
          >
            <Box className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.services')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? s.active : s.inactive)}
            style={pinnedStyle}
          >
            <Wallet className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.finance_and_docs')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.REGISTRATION}
            className={({ isActive }) => (isActive ? s.active : s.inactive)}
            style={pinnedStyle}
          >
            <Social className={s.img} />
            {pinnedStatus && <p className={s.text}>{t('aside_menu.referal_program')}</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.SUPPORT}
            className={({ isActive }) => (isActive ? s.active : s.inactive)}
            style={pinnedStyle}
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
