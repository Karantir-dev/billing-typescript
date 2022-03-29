import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'

import { Icon } from '../Icon'
import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'
import * as routes from '../../routes'

import s from './AsideServicesMenu.module.scss'

export const AsideServicesMenu = () => {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const [isPinned, setIsPinned] = useState(true)

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
        <img
          width="91px"
          height="40px"
          className={cn({ [s.logo]: true, [s.pinned_logo]: !isPinned })}
          src={darkTheme ? logo_dt : logo_lt}
          alt="logo"
        />

        <li className={s.item}>
          <NavLink
            to={routes.HOME}
            className={({ isActive }) => (isActive ? `${s.active}` : `${s.inactive}`)}
            style={{
              paddingBottom: isPinned ? '0px' : '23px',
            }}
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
            {isPinned && <p className={s.text}>Услуги</p>}
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
            {isPinned && <p className={s.text}>Финансы и документы</p>}
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
            {isPinned && <p className={s.text}>Реферальная программа</p>}
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
            {isPinned && <p className={s.text}>Поддержка</p>}
          </NavLink>
        </li>
      </ul>

      <button
        className={cn({ [s.pin_wrapper]: true, [s.transformed]: !isPinned })}
        onClick={handleClick}
      >
        <>
          <Icon
            className={s.pin_icon}
            name="pin"
            width={17}
            height={34}
            isGradient={false}
          />
          <Icon
            className={s.pin_icon_hovered}
            name="pin"
            width={17}
            height={34}
            isGradient={true}
          />
        </>
      </button>
    </nav>
  )
}
