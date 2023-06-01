import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Attention, Cross } from '@images'
import { Backdrop, Button } from '@components'
import { userSelectors, userOperations } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

import s from './EmailTrigger.module.scss'

export default function EmailTrigger() {
  const { t } = useTranslation('other')
  const dispatch = useDispatch()
  const { $email, $email_verified } = useSelector(userSelectors.getUserInfo)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const sendMail = () => {
    dispatch(userOperations.sendVerificationEmail($email))
    setIsModalOpened(false)
  }

  return (
    $email_verified === 'off' && (
      <>
        <button
          className={s.wrapper}
          type="button"
          onClick={() => setIsModalOpened(true)}
        >
          <Attention className={s.icon} />
          {t('email_trigger')}
        </button>

        <Backdrop isOpened={isModalOpened} onClick={() => setIsModalOpened(false)}>
          <div className={s.modal}>
            <div className={s.modal_header}>
              <p className={s.modal_title}>{t('email_verification')}</p>
              <button
                className={s.icon_cross}
                onClick={() => setIsModalOpened(false)}
                type="button"
              >
                <Cross />
              </button>
            </div>
            <p className={s.modal_text}>
              {t('email_verification_text', { email: $email })}
            </p>

            <Button
              className={s.btn}
              isShadow={true}
              label={t('Send')}
              onClick={sendMail}
            />
          </div>
        </Backdrop>
      </>
    )
  )
}
