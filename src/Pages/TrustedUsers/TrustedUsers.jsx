import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Button, UserCard, ManageUserForm } from '@components'
import { userSelectors, usersOperations, usersSelectors } from '@redux'

import * as routes from '@src/routes'

import s from './TrustedUsers.module.scss'
import { usePageRender } from '@utils'

export default function TrustedUsers() {
  const isComponentAllowedToRender = usePageRender('customer', 'user')

  const { t } = useTranslation('trusted_users')

  const dispatch = useDispatch()

  const [readMore, setReadMore] = useState(false)
  const [changeUserRoles, setChangeUserRoles] = useState(false)
  const [createdNewUser, setCreatedNewUser] = useState(false)

  const [isUserFormActive, setIsUserFormActive] = useState(false)
  const handleUserForm = () => {
    setIsUserFormActive(!isUserFormActive)
  }

  const [availableRights, setAvailabelRights] = useState({})

  const checkIfHasArr = availableRights?.toolbar?.toolgrp
  const isCreatingNewUserAllowed = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'new')
    : false

  const laptopOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const subtitleText = t('trusted_users.subtitle')
  const subtitleWrap = useRef(null)

  const handleUserRolesData = () => {
    setChangeUserRoles(!changeUserRoles)
  }
  const checkIfCreatedUser = () => {
    setCreatedNewUser(!createdNewUser)
  }

  const hadndleReadMoreBtn = () => {
    if (!readMore) {
      subtitleWrap.current.style.height = subtitleWrap.current.scrollHeight + 'px'
    } else {
      subtitleWrap.current.removeAttribute('style')
    }

    setReadMore(!readMore)
  }

  const users = useSelector(usersSelectors.getUsers)
  const { $id: pageOwnerId } = useSelector(userSelectors.getUserInfo)

  const hasPageOwnerFullAccess = users.some(user => {
    return user.id.$ === pageOwnerId && user.default_access_allow
  })

  const handleSubmit = values => {
    const { email, name, phone, password } = values

    dispatch(
      usersOperations.createNewUser(password, email, phone, name, checkIfCreatedUser),
    )
  }

  useEffect(() => {
    if (createdNewUser) handleUserForm()
  }, [createdNewUser])

  useEffect(() => {
    if (isComponentAllowedToRender) dispatch(usersOperations.getUsers())
  }, [changeUserRoles, createdNewUser])

  useEffect(() => {
    dispatch(usersOperations.getAvailableRights('user', setAvailabelRights))
  }, [])

  if (!isComponentAllowedToRender) {
    return <Navigate to={routes.HOME} />
  }

  return (
    <>
      <section>
        <div>
          <h3 className={s.section_title}>{t('trusted_users.title')}</h3>
          <div className={s.subtitle_wrapper} ref={subtitleWrap}>
            <p className={classNames({ [s.subtitle]: true })}>{subtitleText}</p>
          </div>
          {!laptopOrHigher && (
            <button className={s.show_more_btn} onClick={hadndleReadMoreBtn}>
              {readMore ? t('trusted_users.read_less') : t('trusted_users.read_more')}
            </button>
          )}
        </div>

        <Button
          dataTestid="trusted_form_btn"
          size="large"
          label={`${t('trusted_users.button')}`.toUpperCase()}
          type="button"
          className={classNames({
            [s.add_btn]: true,
            [s.btn]: true,
            [s.shown]: isCreatingNewUserAllowed,
          })}
          onClick={handleUserForm}
          isShadow
        />

        <h4 className={s.users_title}>{t('trusted_users.users_title')}:</h4>
        <div className={s.table_wrapper}>
          <div className={s.table_header}>
            <p className={s.user_email_lg}>{t('trusted_users.table_header.email')}:</p>
            <p className={s.user_name_lg}>{t('trusted_users.table_header.name')}:</p>
            <p className={s.user_access_lg}>
              {t('trusted_users.table_header.full_access')}:
            </p>
            <p className={s.user_status_lg}>{t('trusted_users.table_header.status')}:</p>
          </div>
        </div>

        {users.map(user => {
          return (
            <UserCard
              key={user.id.$}
              name={user.realname.$}
              email={user.email.$}
              hasAccess={user?.default_access_allow?.$}
              status={user?.enabled?.$}
              userId={user.id.$}
              handleUserRolesData={handleUserRolesData}
              isOwner={user.self.$ === 'on'}
              hasPageOwnerFullAccess={hasPageOwnerFullAccess}
            />
          )
        })}
      </section>

      {isUserFormActive && (
        <ManageUserForm
          closeModal={handleUserForm}
          handleSubmit={handleSubmit}
          title={t('trusted_users.form.title')}
          dataTestid="trusted_form"
          isOpen
        />
      )}
    </>
  )
}
