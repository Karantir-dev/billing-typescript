import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { BurgerListItem, ThemeBtn, LangBtn } from '../../Components'
import { Box, ExitSign, Profile, Social, Support, Wallet } from '../../images'
import { selectors } from '../../Redux/selectors'
import * as routes from '../../routes'

import s from './BurgerMenu.module.scss'

const servicesMenuList = [
  { name: 'Домены', routeName: routes.HOME },
  { name: 'Виртуальные серверы', routeName: routes.HOME },
  { name: 'Выделенные серверы', routeName: routes.HOME },
  { name: 'Виртуальный хостинг', routeName: routes.HOME },
  { name: 'DNS-хостинг', routeName: routes.HOME },
  { name: 'Внешнее FTP хранилище', routeName: routes.HOME },
  { name: 'Забота о сайте', routeName: routes.HOME },
  { name: 'Сервер для Forex', routeName: routes.HOME },
]
const financeMenuList = [
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
]
const supportMenuList = [
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
]
const refProgrammMenuList = [
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
  { name: 'N/A', routeName: routes.HOME },
]
const profileMenuList = [
  { name: 'Настройки профиля', routeName: routes.HOME },
  { name: 'Доверенные пользователи', routeName: routes.HOME },
  { name: 'Журнал посещений', routeName: routes.HOME },
  { name: 'История действий', routeName: routes.HOME },
  { name: 'Договоры', routeName: routes.HOME },
]

export default function BurgerMenu() {
  const { $realname, $email, $balance } = useSelector(selectors.getUserInfo)

  return (
    <div className={s.burger_menu}>
      <nav className={s.burger_nav}>
        <div className={s.theme_btn_wrapper}>
          <ThemeBtn />
        </div>
        <LangBtn />
      </nav>

      <ul className={s.list}>
        <li className={s.list_item}>
          <BurgerListItem
            name={$realname}
            svg={<Profile className={s.icon} />}
            subList={profileMenuList}
            isProfile={true}
            email={$email}
          />
        </li>
        <div className={s.balance_wrapper}>
          <p className={s.balance_text}>Баланс</p>
          <p className={s.balance_sum}>{$balance} EUR</p>
        </div>
        <li className={s.list_item}>
          <BurgerListItem
            name="Услуги"
            svg={<Box className={s.icon} />}
            subList={servicesMenuList}
          />
        </li>
        <li className={s.list_item}>
          <BurgerListItem
            name="Финансы"
            svg={<Wallet className={s.icon} />}
            subList={financeMenuList}
          />
        </li>
        <li className={s.list_item}>
          <BurgerListItem
            name="Реферальная программа"
            svg={<Social className={s.icon} />}
            subList={refProgrammMenuList}
          />
        </li>
        <li className={s.list_item}>
          <BurgerListItem
            name="Поддержка"
            svg={<Support className={s.icon} />}
            subList={supportMenuList}
          />
        </li>
        <li className={s.exit_list_item}>
          <NavLink to={routes.REGISTRATION}>
            <div className={s.exit_wrapper}>
              <ExitSign className={s.icon} />
              <p className={s.exit_name}>Выход</p>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
