import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import { BurgerListItem, ThemeBtn, LangBtn } from '../../Components'
import { ArrowSign, Box, ExitSign, Profile, Social, Support, Wallet } from '../../images'
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

export default function BurgerMenu({ classes, isOpened }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { $realname, $email, $balance } = useSelector(selectors.getUserInfo)

  const [isProfileListOpened, setIsProfileListOpened] = useState(false)
  const [isServicesListOpened, setIsServicesListOpened] = useState(false)
  const [isFinanceListOpened, setIsFinanceListOpened] = useState(false)
  const [isReferalListOpened, setIsReferalListOpened] = useState(false)
  const [isSupportListOpened, setIsSupportListOpened] = useState(false)

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
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => null}
              onClick={() => setIsProfileListOpened(!isProfileListOpened)}
            >
              <BurgerListItem
                name={$realname}
                arrow={
                  <ArrowSign
                    className={cn({
                      [s.arrow_icon]: true,
                      [s.closed]: isProfileListOpened,
                    })}
                  />
                }
                svg={<Profile className={s.icon} />}
                subList={profileMenuList}
                isProfile={true}
                email={$email}
                isListOpened={isProfileListOpened}
              />
            </div>
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
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => null}
              onClick={() => setIsServicesListOpened(!isServicesListOpened)}
            >
              <BurgerListItem
                name="Услуги"
                arrow={
                  <ArrowSign
                    className={cn({
                      [s.arrow_icon]: true,
                      [s.closed]: isServicesListOpened,
                    })}
                  />
                }
                svg={
                  <Box
                    className={cn({
                      [s.icon]: true,
                      [s.active]: isServicesListOpened,
                    })}
                  />
                }
                subList={servicesMenuList}
                isListOpened={isServicesListOpened}
              />
            </div>
          </li>
          <li className={s.list_item}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => null}
              onClick={() => setIsFinanceListOpened(!isFinanceListOpened)}
            >
              <BurgerListItem
                name="Финансы"
                arrow={
                  <ArrowSign
                    className={cn({
                      [s.arrow_icon]: true,
                      [s.closed]: isFinanceListOpened,
                    })}
                  />
                }
                svg={
                  <Wallet
                    className={cn({
                      [s.icon]: true,
                      [s.active]: isFinanceListOpened,
                    })}
                  />
                }
                subList={financeMenuList}
                isListOpened={isFinanceListOpened}
              />
            </div>
          </li>
          <li className={s.list_item}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => null}
              onClick={() => setIsReferalListOpened(!isReferalListOpened)}
            >
              <BurgerListItem
                name="Реферальная программа"
                arrow={
                  <ArrowSign
                    className={cn({
                      [s.arrow_icon]: true,
                      [s.closed]: isReferalListOpened,
                    })}
                  />
                }
                svg={
                  <Social
                    className={cn({
                      [s.icon]: true,
                      [s.active]: isReferalListOpened,
                    })}
                  />
                }
                subList={refProgrammMenuList}
                isListOpened={isReferalListOpened}
              />
            </div>
          </li>
          <li className={s.list_item}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => null}
              onClick={() => setIsSupportListOpened(!isSupportListOpened)}
            >
              <BurgerListItem
                name="Поддержка"
                arrow={
                  <ArrowSign
                    className={cn({
                      [s.arrow_icon]: true,
                      [s.closed]: isSupportListOpened,
                    })}
                  />
                }
                svg={
                  <Support
                    className={cn({
                      [s.icon]: true,
                      [s.active]: isSupportListOpened,
                    })}
                  />
                }
                subList={supportMenuList}
                isListOpened={isSupportListOpened}
              />
            </div>
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
