import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'
import qs from 'qs'

import { BurgerMenu } from '../../Components'
import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'
import Icon from '../Icon/Icon'
import * as routes from '../../routes'

import s from './Header.module.scss'
import { BASE_URL } from '../../config/config'
import axios from 'axios'

export default function Header() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  // const axiosInstance = axios.create({
  //   baseURL: BASE_URL,
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  // })

  // const getUserInfo = () => {
  //   axiosInstance
  //     .post(
  //       '/',
  //       qs.stringify({
  //         func: 'whoami',
  //         out: 'json',
  //         auth: 'ec8be596c40712d375e9509d',
  //       }),
  //     )
  //     .then(({ data }) => {
  //       console.log(data.doc)
  //     })
  //     .catch(error => {
  //       console.log('error', error)
  //     })
  // }

  // useEffect(() => {
  //   // getUserInfo()
  // }, [])

  // const getTickets = () => {
  //   axiosInstance
  //     .post(
  //       '/',
  //       qs.stringify({
  //         func: 'dashboard.tickets',
  //         out: 'json',
  //         lang: 'en',
  //         auth: 'ec8be596c40712d375e9509d',
  //       }),
  //     )
  //     .then(({ data }) => {
  //       console.log(data.doc)
  //     })
  //     .catch(error => {
  //       console.log('error', error)
  //     })
  // }

  // useEffect(() => {
  //   // getTickets()
  // }, [])

  // const getItems = () => {
  //   axiosInstance
  //     .post(
  //       '/',
  //       qs.stringify({
  //         func: 'dashboard.items',
  //         out: 'json',
  //         lang: 'en',
  //         auth: 'ec8be596c40712d375e9509d',
  //       }),
  //     )
  //     .then(({ data }) => {
  //       console.log(data.doc)
  //     })
  //     .catch(error => {
  //       console.log('error', error)
  //     })
  // }

  // useEffect(() => {
  //   getItems()
  //   getUserInfo()
  // }, [])

  return (
    <>
      <header className={s.main_header}>
        <img
          width="93px"
          height="41px"
          className={s.logo}
          src={darkTheme ? logo_dt : logo_lt}
          alt="logo"
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

            <li className={s.item} onClick={handleClick}>
              <NavLink to={routes.HOME} className={s.link}>
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
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      {isMenuOpened && <BurgerMenu />}
    </>
  )
}
