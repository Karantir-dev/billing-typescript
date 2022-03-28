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

  return (
    <nav className={darkTheme ? s.navigation_dt : s.navigation_lt}>
      <ul className={darkTheme ? s.navigation__list_dt : s.navigation__list}>
        <img
          width="91px"
          height="40px"
          className={s.logo}
          src={darkTheme ? logo_dt : logo_lt}
          alt="logo"
          onload="this.style.opacity = '1'"
        />
        <li className={s.item}>
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
          >
            <Icon
              className={s.img}
              name="box"
              width={25}
              height={25}
              isGradient={false}
            />
            <Icon
              className={s.img_hovered}
              name="box"
              width={25}
              height={25}
              isGradient={true}
            />
            <p className={darkTheme ? s.text_dt : s.text_lt}>Услуги</p>
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
          >
            <Icon
              className={s.img}
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
            <p className={darkTheme ? s.text_dt : s.text_lt}>Финансы и документы</p>
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.REGISTRATION}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
          >
            <Icon
              className={s.img}
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
            <p className={darkTheme ? s.text_dt : s.text_lt}>Реферальная программа</p>
          </NavLink>
        </li>
        <li className={s.item}>
          <NavLink
            to={routes.RESET_PASSWORD}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
          >
            <Icon
              className={s.img}
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
            <p className={darkTheme ? s.text_dt : s.text_lt}>Поддержка</p>
          </NavLink>
        </li>
      </ul>

      <div className={s.pin_wrapper} onClick={() => `${s.text}_inactive`}>
        <Icon className={s.img} name="pin" width={17} height={34} isGradient={false} />
        <Icon
          className={s.img_hovered}
          name="pin"
          width={17}
          height={34}
          isGradient={true}
        />
      </div>
    </nav>
  )
}
