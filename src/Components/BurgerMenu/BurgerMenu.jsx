import React from 'react'

import { Icon } from '..'
import { BurgerListItem, ThemeBtn, LangBtn } from '../../Components'
import calendar_dt from '../../images/calendar_dt.svg'

import * as routes from '../../routes'

import s from './BurgerMenu.module.scss'

export default function BurgerMenu() {
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

  return (
    <section className={s.burger_menu}>
      <nav className={s.burger_nav}>
        <ThemeBtn />
        <LangBtn />
        {/* <button>X</button> */}
      </nav>

      <ul>
        <li className={s.list_item}>
          <BurgerListItem
            name={'name from ajax'}
            svg={calendar_dt}
            subList={profileMenuList}
            isProfile={true}
            email={'from ajax request'}
          />
        </li>
        <li className={s.list_item}>
          <BurgerListItem name="Услуги" svg={calendar_dt} subList={servicesMenuList} />
        </li>
        <li className={s.list_item}>
          <BurgerListItem name="Финансы" svg={calendar_dt} subList={financeMenuList} />
        </li>
        <li className={s.list_item}>
          <BurgerListItem
            name="Реферальная программа"
            svg={calendar_dt}
            subList={refProgrammMenuList}
          />
        </li>
        <li className={s.list_item}>
          <BurgerListItem name="Поддержка" svg={calendar_dt} subList={supportMenuList} />
        </li>
      </ul>
    </section>
  )
}
