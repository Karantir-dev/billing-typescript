import cn from 'classnames'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ThemeBtn, LangBtn } from '../../../../Components'
import { ExitSign } from '../../../../images'
import ListItems from './ListItems/ListItems'
import { userSelectors, authOperations, selectors } from '../../../../Redux'
import { useOutsideAlerter, usePageRender } from '../../../../utils'
import * as routes from '../../../../routes'

import s from './BurgerMenu.module.scss'

export default function BurgerMenu({ classes, isOpened, controlMenu }) {
  const { t } = useTranslation('container')

  const isTrustedUsersAllowedToRender = usePageRender('customer', 'user', false)

  const isAuthLogAllowedToRender = usePageRender('stat', 'authlog', false)
  const areServicesAllowedToRender = usePageRender('mainmenuservice', null, false)
  const isFinanceAllowedToRender = usePageRender('finance', null, false)
  const areUserSettingsAllowedToRender = usePageRender('customer', 'usrparam', false)
  const isAffiliateProgramAllowedToRender = usePageRender(
    'customer',
    'affiliate.client',
    false,
  )
  const isSupportAllowedToRender = usePageRender('support', null, false)
  const isArchiveAllowedToRender = usePageRender('support', 'clientticket_archive', false)
  const isRequestsAllowedToRender = usePageRender('support', 'clientticket', false)
  const arePayersAllowedToRender = usePageRender('customer', 'profile', false)

  const profileMenuList = [
    {
      name: t('profile.user_settings'),
      routeName: routes.USER_SETTINGS,
      allowedToRender: areUserSettingsAllowedToRender,
    },
    {
      name: t('profile.trusted_users'),
      routeName: routes.TRUSTED_USERS,
      allowedToRender: isTrustedUsersAllowedToRender,
    },
    {
      name: t('profile.visiting_log'),
      routeName: routes.ACCESS_LOG,
      allowedToRender: isAuthLogAllowedToRender,
    },
    {
      name: t('profile.payers'),
      routeName: routes.PAYERS,
      allowedToRender: arePayersAllowedToRender,
    },
    { name: t('profile.contracts'), routeName: routes.CONTRACTS, allowedToRender: true },
  ]

  const profileMenuListToRender = profileMenuList.filter(item => item.allowedToRender)

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.domains'),
      routeName: routes.DOMAINS,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      routeName: routes.DEDICATED_SERVERS,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
    { name: t('burger_menu.services.services_list.dns_hosting'), routeName: routes.HOME },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
  ]
  const refProgrammMenuList = [
    {
      name: t('burger_menu.ref_program.ref_program_list.about_program'),
      routeName: `${routes.AFFILIATE_PROGRAM}/${routes.AFFILIATE_PROGRAM_ABOUT}`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.incomes'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.statistic'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
  ]

  const supportMenuList = [
    {
      name: t('burger_menu.support.support_list.requests'),
      routeName: `${routes.SUPPORT}/requests`,
      allowedToRender: isRequestsAllowedToRender,
    },

    {
      name: t('burger_menu.support.support_list.requests_archieve'),
      routeName: `${routes.SUPPORT}/requests_archive`,
      allowedToRender: isArchiveAllowedToRender,
    },
  ]

  const financeMenuList = [
    {
      name: t('burger_menu.finance.finance_list.automatic_payment'),
      routeName: `${routes.BILLING}/auto_payment`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.finance.finance_list.payments'),
      routeName: `${routes.BILLING}/payments`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.finance.finance_list.expenses'),
      routeName: `${routes.BILLING}/expenses`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.finance.finance_list.auto_renewal'),
      routeName: routes.HOME,
      allowedToRender: true,
    },
  ]

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { $realname, $email, $balance } = useSelector(userSelectors.getUserInfo)

  const dispatch = useDispatch()
  const getBurgerEl = useRef()

  useOutsideAlerter(getBurgerEl, isOpened, controlMenu)

  const logOut = () => {
    controlMenu()
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
              subList={profileMenuListToRender}
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
          {areServicesAllowedToRender && (
            <li className={s.list_item}>
              <ListItems
                controlMenu={controlMenu}
                name={'services'}
                subList={servicesMenuList}
              />
            </li>
          )}
          {isFinanceAllowedToRender && (
            <li className={s.list_item}>
              <ListItems
                controlMenu={controlMenu}
                name={'finance'}
                subList={financeMenuList}
              />
            </li>
          )}

          {isAffiliateProgramAllowedToRender && (
            <li className={s.list_item}>
              <ListItems
                controlMenu={controlMenu}
                name={'ref_program'}
                subList={refProgrammMenuList}
              />
            </li>
          )}
          {isSupportAllowedToRender && (
            <li className={s.list_item}>
              <ListItems
                controlMenu={controlMenu}
                name={'support'}
                subList={supportMenuList}
              />
            </li>
          )}
          <li className={s.exit_list_item}>
            <NavLink to={routes.LOGIN}>
              <div
                className={s.exit_wrapper}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
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
  controlMenu: PropTypes.func.isRequired,
}
