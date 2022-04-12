import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

import { Button } from '..'
import UserCard from './UserCard/UserCard'
import { usersOperations } from '../../Redux/users/usersOperations'
import { usersSelectors } from '../../Redux/users/usersSelectors'

import s from './TrustedUsers.module.scss'
import Container from '../Container/Container'
import AddUserForm from './AddUserForm/AddUserForm'

export default function TrustedUsers() {
  const dispatch = useDispatch()
  const users = useSelector(usersSelectors.getUsers)

  const [readMore, setReadMore] = useState(false)
  const [changeUserRoles, setChangeUserRoles] = useState(false)

  const [isUserFormActive, setIsUserFormActive] = useState(false)
  const handleUserForm = () => {
    setIsUserFormActive(!isUserFormActive)
  }

  const laptopOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const subtitleText =
    'Доверенные пользователи — лица, которым вы доверяете доступ к вашему личному кабинету. Это может быть полезно, когда, например, несколько человек управляет серверами или доменами вашего аккаунта. Вы можете управлять их правами доступа к функциональности личного кабинета.'

  const slicedSubtitle = subtitleText.split('').slice(0, 85).join('') + '...'

  const handleUserRolesData = () => {
    setChangeUserRoles(!changeUserRoles)
  }

  useEffect(() => {
    dispatch(usersOperations.getUsers())
  }, [changeUserRoles])

  return (
    <Container>
      <section>
        <div>
          <h3 className={s.section_title}>Доверенные пользователи</h3>

          <p className={classNames({ [s.subtitle]: true })}>
            {laptopOrHigher ? subtitleText : readMore ? subtitleText : slicedSubtitle}
          </p>
          <button className={s.show_more_btn} onClick={() => setReadMore(!readMore)}>
            {readMore ? 'show less' : 'Read more'}
          </button>
        </div>

        <Button
          size="large"
          label={'Добавить'}
          type="button"
          className={s.add_btn}
          onClick={handleUserForm}
        />

        <div className={s.table_wrapper}>
          <div className={s.table_header}>
            <p className={s.user_email_lg}>Email:</p>
            <p className={s.user_name_lg}>ФИО или название:</p>
            <p className={s.user_access_lg}>Полный доступ:</p>
            <p className={s.user_status_lg}>Статус:</p>
            <p></p>
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
            />
          )
        })}
      </section>
      {isUserFormActive && <AddUserForm />}
    </Container>
  )
}
