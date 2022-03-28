import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Icon } from '../Icon'
import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'

import * as routes from '../../routes'

import s from './AsideServicesMenu.module.scss'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'

export const AsideServicesMenu = () => {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const [isPinned, setIsPinned] = useState(true)

  const handleClick = e => {
    e.preventDefault()
    setIsPinned(!isPinned)
    console.log('is clicked')
  }

  return (
    <nav
      className={darkTheme ? s.navigation_dt : s.navigation_lt}
      style={isPinned ? { width: '138px' } : { width: '68px' }}
    >
      <ul
        className={darkTheme ? s.navigation__list_dt : s.navigation__list}
        style={isPinned ? { width: '138px' } : { width: '68px' }}
      >
        {isPinned ? (
          <img
            width="91px"
            height="40px"
            className={s.logo}
            src={darkTheme ? logo_dt : logo_lt}
            alt="logo"
            onload="this.style.opacity = '1'"
          />
        ) : (
          <img
            width="45px"
            height="20px"
            className={s.logo}
            src={darkTheme ? logo_dt : logo_lt}
            alt="logo"
            onload="this.style.opacity = '1'"
          />
        )}
        <li
          className={s.item}
          // style={darkTheme ? { background: '#383245' } : { background: '#FFFDFE' }}
        >
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={({ isActive }) => ({
              boxShadow: isActive ? '-4px 0px 10px rgba(65, 38, 114, 0.15)' : '',
              paddingBottom: isPinned ? '0px' : '23px',
            })}
          >
            <Icon
              className={darkTheme ? s.img_dt : s.img_lt}
              style={isPinned ? { marginTop: '0px' } : { marginTop: '23px' }}
              name="box"
              width={25}
              height={25}
              isGradient={false}
            />
            <Icon
              className={s.img_hovered}
              style={isPinned ? { marginTop: '0px' } : { marginTop: '23px' }}
              name="box"
              width={25}
              height={25}
              isGradient={true}
            />
            {isPinned && <p className={darkTheme ? s.text_dt : s.text_lt}>Услуги</p>}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={({ isActive }) => ({
              boxShadow: isActive ? '-4px 0px 10px rgba(65, 38, 114, 0.15)' : '',
              paddingBottom: isPinned ? '0px' : '23px',
            })}
          >
            <Icon
              className={darkTheme ? s.img_dt : s.img_lt}
              name="wallet"
              width={25}
              height={25}
              isGradient={false}
            />
            <Icon
              className={s.img_hovered}
              name="wallet"
              width={25}
              height={25}
              isGradient={true}
            />
            {isPinned && (
              <p className={darkTheme ? s.text_dt : s.text_lt}>Финансы и документы</p>
            )}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.REGISTRATION}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={({ isActive }) => ({
              boxShadow: isActive ? '-4px 0px 10px rgba(65, 38, 114, 0.15)' : '',
              paddingBottom: isPinned ? '0px' : '23px',
            })}
          >
            <Icon
              className={darkTheme ? s.img_dt : s.img_lt}
              name="social"
              width={26}
              height={26}
              isGradient={false}
            />
            <Icon
              className={s.img_hovered}
              name="social"
              width={26}
              height={26}
              isGradient={true}
            />
            {isPinned && (
              <p className={darkTheme ? s.text_dt : s.text_lt}>Реферальная программа</p>
            )}
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={({ isActive }) => ({
              boxShadow: isActive ? '-4px 0px 10px rgba(65, 38, 114, 0.15)' : '',
              paddingBottom: isPinned ? '0px' : '23px',
            })}
          >
            <Icon
              className={darkTheme ? s.img_dt : s.img_lt}
              name="support"
              width={28}
              height={28}
              isGradient={false}
            />
            <Icon
              className={s.img_hovered}
              name="support"
              width={28}
              height={28}
              isGradient={true}
            />
            {isPinned && <p className={darkTheme ? s.text_dt : s.text_lt}>Поддержка</p>}
          </NavLink>
        </li>
      </ul>

      <div className={s.pin_wrapper} onClick={handleClick}>
        {isPinned ? (
          <>
            <Icon
              className={darkTheme ? `${s.img_dt}` : `${s.img_lt}`}
              style={isPinned ? { marginTop: '0px' } : { marginTop: '23px' }}
              name="pin"
              width={17}
              height={34}
              isGradient={false}
            />
            <Icon
              className={`${s.img_hovered}`}
              name="pin"
              width={17}
              height={34}
              isGradient={true}
            />
          </>
        ) : (
          <Icon
            className={`${s.img_pinned}`}
            name="pin"
            width={17}
            height={34}
            isGradient={true}
          />
        )}
      </div>
    </nav>
  )
}
