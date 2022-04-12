import cn from 'classnames'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ThemeBtn, LangBtn } from '../../../../Components'
import { ExitSign } from '../../../../images'
import ListItems from './ListItems/ListItems'
import { selectors } from '../../../../Redux/selectors'
import { userSelectors } from '../../../../Redux/userInfo/userSelectors'
import { authOperations } from '../../../../Redux/auth/authOperations'
import { useOutsideAlerter } from '../../../../utils'
import * as routes from '../../../../routes'

import s from './BurgerMenu.module.scss'

export default function BurgerMenu({ classes, isOpened, controlMenu }) {
  const { t } = useTranslation('main')

  const profileMenuList = [
    { name: t('profile.user_settings'), routeName: routes.HOME },
    { name: t('profile.trusted_users'), routeName: routes.HOME },
    { name: t('profile.visiting_log'), routeName: routes.ACCESS_LOG },
    { name: t('profile.activity_log'), routeName: routes.HOME },
    { name: t('profile.contracts'), routeName: routes.HOME },
  ]

  const servicesMenuList = [
    { name: t('burger_menu.services.services_list.domains'), routeName: routes.HOME },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      routeName: routes.HOME,
    },
    { name: t('burger_menu.services.services_list.dns_hosting'), routeName: routes.HOME },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      routeName: routes.HOME,
    },
  ]
  const refProgrammMenuList = [
    {
      name: t('burger_menu.ref_program.ref_program_list.about_program'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.incomes'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.statistic'),
      routeName: routes.HOME,
    },
  ]

  const supportMenuList = [
    {
      name: t('burger_menu.support.support_list.requests'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.support.support_list.requests_archieve'),
      routeName: routes.HOME,
    },
  ]

  const financeMenuList = [
    {
      name: t('burger_menu.finance.finance_list.automatic_payment'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.finance.finance_list.payments'),
      routeName: routes.HOME,
    },
    {
      name: t('burger_menu.finance.finance_list.expenses'),
      routeName: routes.HOME,
    },
    { name: t('burger_menu.finance.finance_list.auto_renewal'), routeName: routes.HOME },
  ]

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { $realname, $email, $balance } = useSelector(userSelectors.getUserInfo)

  const dispatch = useDispatch()
  const getBurgerEl = useRef()

  useOutsideAlerter(getBurgerEl, isOpened, controlMenu)

  const logOut = () => {
    dispatch(authOperations.logout())
  }

  return (
    <div className={isOpened ? s.burger : ''}>
      <div ref={getBurgerEl} className={classes}>
        <nav className={s.burger_nav}>
          <div className={s.theme_btn_wrapper}>
            <ThemeBtn burgerType />
          </div>
          <LangBtn burgerType />
        </nav>

        <ul className={s.list}>
          <li className={s.list_item}>
            <ListItems
              controlMenu={controlMenu}
              name={$realname}
              subList={profileMenuList}
              isProfile
              email={$email}
            />
          </li>
          <li
            className={cn({
              [s.balance_wrapper]: true,
              [darkTheme ? s.balance_wrapper_dt : s.balance_wrapper_lt]: true,
            })}
          >
            <p className={s.balance_text}>{t('balance')}</p>
            <p className={s.balance_sum}>{$balance} EUR</p>
          </li>
          <li className={s.list_item}>
            <ListItems
              controlMenu={controlMenu}
              name={'services'}
              subList={servicesMenuList}
            />
          </li>
          <li className={s.list_item}>
            <ListItems
              controlMenu={controlMenu}
              name={'finance'}
              subList={financeMenuList}
            />
          </li>
          <li className={s.list_item}>
            <ListItems
              controlMenu={controlMenu}
              name={'ref_program'}
              subList={refProgrammMenuList}
            />
          </li>
          <li className={s.list_item}>
            <ListItems
              controlMenu={controlMenu}
              name={'support'}
              subList={supportMenuList}
            />
          </li>
          <li className={s.exit_list_item}>
            <NavLink to={routes.LOGIN}>
              <div
                className={s.exit_wrapper}
                role="button"
                tabIndex={0}
                onKeyDown={() => null}
                onClick={logOut}
              >
                <ExitSign className={s.icon} />
                <p className={s.exit_name}>{t('profile.log_out')}</p>
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
