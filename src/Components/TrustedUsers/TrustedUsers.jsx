import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Button } from '..'
import { usersOperations } from '../../Redux/users/usersOperations'
import { usersSelectors } from '../../Redux/users/usersSelectors'

import s from './TrustedUsers.module.scss'
import UserCard from './UserCard/UserCard'

export default function TrustedUsers() {
  const dispatch = useDispatch()
  const users = useSelector(usersSelectors.getUsers)
  console.log(users)

  const [readMore, setReadMore] = useState(false)
  const laptopOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const subtitleText =
    'Доверенные пользователи — лица, которым вы доверяете доступ к вашему личному кабинету. Это может быть полезно, когда, например, несколько человек управляет серверами или доменами вашего аккаунта. Вы можете управлять их правами доступа к функциональности личного кабинета.'

  const slicedSubtitle = subtitleText.split('').slice(0, 85).join('') + '...'

  useEffect(() => {
    dispatch(usersOperations.getUsers())
  }, [])

  return (
    <>
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

        <Button size="large" label={'Добавить'} type="button" className={s.add_btn} />

        {users.map(user => {
          return (
            <UserCard
              key={user.id.$}
              name={user.realname.$}
              email={user.email.$}
              hasAccess={user?.default_access_allow?.$}
              status={user?.enabled?.$}
            />
          )
        })}
      </section>
    </>
  )
}
