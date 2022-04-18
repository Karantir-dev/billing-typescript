import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'

import { Button } from '..'
import UserCard from './UserCard/UserCard'
import Container from '../Container/Container'
import AddUserForm from './AddUserForm/AddUserForm'
import { usersOperations } from '../../Redux/users/usersOperations'
import { usersSelectors } from '../../Redux/users/usersSelectors'

import s from './TrustedUsers.module.scss'
import AccessRights from './AccessRights/AccessRights'

const clientRightsList = [
  {
    element: { text: 'Allow all' },
  },
  {
    element: { text: 'Create' },
  },
  {
    title: 'Change',
    children: [
      {
        element: {
          text: 'Редактирование информации о пользователе с доступом к чтению данных формы',
        },
      },
      {
        element: {
          text: 'Редактирование информации о пользователе с доступом к сохранению данных',
        },
      },
    ],
  },
  {
    element: { text: 'Remove' },
  },
  {
    element: { text: 'Turn on' },
  },
  {
    element: { text: 'Turn off' },
  },

  {
    title: 'Rights',
    children: [
      {
        element: {
          text: 'Turn on',
        },
      },
      {
        element: {
          text: 'Turn off',
        },
      },

      {
        title: 'Functions',
        children: [
          {
            element: {
              text: 'Turn on',
            },
          },
          {
            element: {
              text: 'Turn off',
            },
          },
          {
            element: {
              text: 'Filter',
            },
          },
        ],
      },
      {
        element: {
          text: 'Filter',
        },
      },
    ],
  },
  {
    element: { text: 'History' },
  },
  {
    element: { text: 'Filter' },
  },
]

export default function TrustedUsers() {
  const { t } = useTranslation('trusted_users')
  const dispatch = useDispatch()

  const [readMore, setReadMore] = useState(false)
  const [changeUserRoles, setChangeUserRoles] = useState(false)
  const [createdNewUser, setCreatedNewUser] = useState(false)

  const [isUserFormActive, setIsUserFormActive] = useState(false)
  const handleUserForm = () => {
    setIsUserFormActive(!isUserFormActive)
  }

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

  useEffect(() => {
    dispatch(usersOperations.getUsers())
  }, [changeUserRoles, createdNewUser])

  return (
    <Container>
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
          className={s.add_btn}
          onClick={handleUserForm}
        />

        <h4 className={s.users_title}>{t('trusted_users.users_title')}</h4>
        <div className={s.table_wrapper}>
          <div className={s.table_header}>
            <p className={s.user_email_lg}>{t('trusted_users.table_header.email')}:</p>
            <p className={s.user_name_lg}>{t('trusted_users.table_header.name')}:</p>
            <p className={s.user_access_lg}>
              {t('trusted_users.table_header.full_access')}:
            </p>
            <p className={s.user_status_lg}>{t('trusted_users.table_header.status')}:</p>
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
              isOwner={user.self.$ === 'on'}
            />
          )
        })}
      </section>
      {isUserFormActive && (
        <AddUserForm
          controlForm={handleUserForm}
          checkIfCreatedUser={checkIfCreatedUser}
          dataTestid="trusted_form"
        />
      )}

      <AccessRights
        userId={1}
        userName={'Someone'}
        alert={true}
        items={clientRightsList}
      />
    </Container>
  )
}
