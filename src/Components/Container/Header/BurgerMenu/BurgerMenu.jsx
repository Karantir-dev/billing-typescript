import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ThemeBtn, LangBtn, Portal, ModalCreatePayment } from '../../../../Components'
import { ExitSign } from '../../../../images'
import ListItems from './ListItems/ListItems'
import { userSelectors, authOperations, selectors } from '../../../../Redux'
import { useOutsideAlerter, usePageRender } from '../../../../utils'
import * as routes from '../../../../routes'

import s from './BurgerMenu.module.scss'

export default function BurgerMenu({ classes, isOpened, controlMenu }) {
  const { t } = useTranslation('container')

  const [createPaymentModal, setCreatePaymentModal] = useState(false)

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
  const areContractsAllowedToRender = usePageRender('customer', 'contract', false)

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
    {
      name: t('profile.contracts'),
      routeName: routes.CONTRACTS,
      allowedToRender: areContractsAllowedToRender,
    },
  ]

  const profileMenuListToRender = profileMenuList.filter(item => item.allowedToRender)

  // SERVICES
  const isDomainsAllowedToRender = usePageRender('mainmenuservice', 'domain', false)
  const isVdsAllowedToRender = usePageRender('mainmenuservice', 'vds', false)
  const isDedicactedAllowedToRender = usePageRender('mainmenuservice', 'dedic', false)
  const isVirtualHostAllowedToRender = usePageRender('mainmenuservice', 'vhost', false)
  const isDnsAllowedToRender = usePageRender('mainmenuservice', 'dnshost', false)
  const isFtpAllowedToRender = usePageRender('mainmenuservice', 'storage', false)
  const isWebsitecareAllowedToRender = usePageRender(
    'mainmenuservice',
    'zabota-o-servere',
    false,
  )
  // zabota-o-servere !!! this func is not provided in mainmenuservice, needs to be checked
  const isForexServerAllowedToRender = usePageRender('mainmenuservice', 'forexbox', false) //funcname wuwuwuw

  const servicesMenuList = [
    {
      name: t('burger_menu.services.services_list.domains'),
      routeName: routes.DOMAINS,
      allowedToRender: isDomainsAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.virtual_servers'),
      routeName: routes.VDS,
      allowedToRender: isVdsAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.dedicated_servers'),
      routeName: routes.DEDICATED_SERVERS,
      allowedToRender: isDedicactedAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.virtual_hosting'),
      routeName: routes.SHARED_HOSTING,
      allowedToRender: isVirtualHostAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.dns_hosting'),
      routeName: routes.DNS,
      allowedToRender: isDnsAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.external_ftp'),
      routeName: routes.FTP,
      allowedToRender: isFtpAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.wetsite_care'),
      routeName: routes.SITE_CARE,
      allowedToRender: isWebsitecareAllowedToRender,
    },
    {
      name: t('burger_menu.services.services_list.forex_server'),
      routeName: routes.FOREX,
      allowedToRender: isForexServerAllowedToRender,
    },
  ]

  // REF PROGRAMM
  const refProgrammMenuList = [
    {
      name: t('burger_menu.ref_program.ref_program_list.about_program'),
      routeName: `${routes.AFFILIATE_PROGRAM}/${routes.AFFILIATE_PROGRAM_ABOUT}`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.incomes'),
      routeName: `${routes.AFFILIATE_PROGRAM}/${routes.AFFILIATE_PROGRAM_INCOME}`,
      allowedToRender: true,
    },
    {
      name: t('burger_menu.ref_program.ref_program_list.statistic'),
      routeName: `${routes.AFFILIATE_PROGRAM}/${routes.AFFILIATE_PROGRAM_STATISTICS}`,
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
    // {
    //   name: t('burger_menu.finance.finance_list.auto_renewal'),
    //   routeName: routes.HOME,
    //   allowedToRender: true,
    // },
  ]

  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const { $realname, $email, $balance } = useSelector(userSelectors.getUserInfo)

  const userItems = useSelector(userSelectors.getUserItems)

  const dispatch = useDispatch()
  const getBurgerEl = useRef()

  useOutsideAlerter(getBurgerEl, isOpened, controlMenu)

  const logOut = () => {
    controlMenu()
    dispatch(authOperations.logout())
  }

  const [activeList, setActiveList] = useState([
    { active: false, listId: 1, listName: 'profile' },
    { active: false, listId: 2, listName: 'services' },
    { active: false, listId: 3, listName: 'finance' },
    { active: false, listId: 4, listName: 'affiliate_program' },
    { active: false, listId: 5, listName: 'support' },
  ])

  function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec)
    return Math.trunc(num * calcDec) / calcDec
  }

  const userBalance = userItems?.$balance?.replace(' €', '')?.replace(' EUR', '')

  return (
    <>
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
                id={1}
                activeList={activeList}
                setActiveList={setActiveList}
              />
            </li>
            <li
              className={cn({
                [s.balance_wrapper]: true,
                [darkTheme ? s.balance_wrapper_dt : s.balance_wrapper_lt]: true,
              })}
            >
              <button
                onClick={() => {
                  controlMenu()
                  setCreatePaymentModal(!createPaymentModal)
                }}
                className={s.balance_wrapper_btn}
              >
                <p className={s.balance_text}>{t('balance')}</p>
                <p className={s.balance_sum}>
                  {userItems?.$balance
                    ? truncateToDecimals(userBalance, 2)?.toFixed(2)
                    : truncateToDecimals($balance, 2)?.toFixed(2)}
                  EUR
                </p>
              </button>
            </li>
            {areServicesAllowedToRender && (
              <li className={s.list_item}>
                <ListItems
                  controlMenu={controlMenu}
                  name={'services'}
                  subList={servicesMenuList}
                  id={2}
                  activeList={activeList}
                  setActiveList={setActiveList}
                />
              </li>
            )}
            {isFinanceAllowedToRender && (
              <li className={s.list_item}>
                <ListItems
                  controlMenu={controlMenu}
                  name={'finance'}
                  subList={financeMenuList}
                  id={3}
                  activeList={activeList}
                  setActiveList={setActiveList}
                />
              </li>
            )}

            {isAffiliateProgramAllowedToRender && (
              <li className={s.list_item}>
                <ListItems
                  controlMenu={controlMenu}
                  name={'ref_program'}
                  subList={refProgrammMenuList}
                  id={4}
                  activeList={activeList}
                  setActiveList={setActiveList}
                />
              </li>
            )}
            {isSupportAllowedToRender && (
              <li className={s.list_item}>
                <ListItems
                  controlMenu={controlMenu}
                  name={'support'}
                  subList={supportMenuList}
                  id={5}
                  activeList={activeList}
                  setActiveList={setActiveList}
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

      <Portal>
        {createPaymentModal && (
          <ModalCreatePayment setCreatePaymentModal={setCreatePaymentModal} />
        )}
      </Portal>
    </>
  )
}

BurgerMenu.propTypes = {
  classes: PropTypes.string.isRequired,
  isOpened: PropTypes.bool.isRequired,
  controlMenu: PropTypes.func.isRequired,
}
