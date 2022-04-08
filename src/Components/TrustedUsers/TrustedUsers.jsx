import classNames from 'classnames'
import React, { useState } from 'react'
import { Button } from '..'

import s from './TrustedUsers.module.scss'

export default function TrustedUsers() {
  const [readMore, setReadMore] = useState(false)
  const subtitleText =
    'Доверенные пользователи — лица, которым вы доверяете доступ к вашему личному кабинету. Это может быть полезно, когда, например, несколько человек управляет серверами или доменами вашего аккаунта. Вы можете управлять их правами доступа к функциональности личного кабинета.'

  const slicedSubtitle = subtitleText.split('').slice(0, 85).join('') + '...'

  return (
    <>
      <section>
        <div>
          <h3 className={s.section_title}>Доверенные пользователи</h3>

          <p className={classNames({ [s.subtitle]: true })}>
            {readMore ? subtitleText : slicedSubtitle}
          </p>
          <button onClick={() => setReadMore(!readMore)}>
            {readMore ? 'show less' : 'Read more'}
          </button>
        </div>

        <Button size="large" label={'Добавить'} type="button" className={s.add_btn} />
        <p className={s.users_title}>Ваши пользователи</p>
        <div>users card - component</div>
      </section>
    </>
  )
}
