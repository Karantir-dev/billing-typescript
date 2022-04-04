import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ThemeBtn, LangBtn } from '../../Components'
import { ExitSign } from '../../images'
import ListItems from './ListItems/ListItems'
import { selectors } from '../../Redux/selectors'
import { userSelectors } from '../../Redux/userInfo/userSelectors'
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

export default function BurgerMenu({ classes, isOpened }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { $realname, $email, $balance } = useSelector(userSelectors.getUserInfo)

  return (
    <div className={isOpened ? s.burger : ''}>
      <div className={classes}>
        <nav className={s.burger_nav}>
          <div className={s.theme_btn_wrapper}>
            <ThemeBtn />
          </div>
          <LangBtn />
        </nav>

        <ul className={s.list}>
          <li className={s.list_item}>
            <ListItems
              name={$realname}
              subList={profileMenuList}
              isProfile
              email={$email}
            />
          </li>
          <li
            className={cn({
              [s.balance_wrapper]: true,
              [s.balance_wrapper_lt]: !darkTheme,
            })}
          >
            <p className={s.balance_text}>Баланс</p>
            <p className={s.balance_sum}>{$balance} EUR</p>
          </li>
          <li className={s.list_item}>
            <ListItems name={'Услуги'} subList={servicesMenuList} />
          </li>
          <li className={s.list_item}>
            <ListItems name={'Финансы'} subList={financeMenuList} />
          </li>
          <li className={s.list_item}>
            <ListItems name={'Реферальная программа'} subList={refProgrammMenuList} />
          </li>
          <li className={s.list_item}>
            <ListItems name={'Поддержка'} subList={supportMenuList} />
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
    </div>
  )
}

BurgerMenu.propTypes = {
  classes: PropTypes.string.isRequired,
  isOpened: PropTypes.bool.isRequired,
}
