import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Modal } from '@components'
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
          <Icon name="Attention" className={s.icon} />
          {t('email_trigger')}
        </button>

        <Modal
          isOpen={isModalOpened}
          closeModal={() => setIsModalOpened(false)}
          simple
          className={s.modal}
        >
          <Modal.Header>
            <p className={s.modal_title}>{t('email_verification')}</p>
          </Modal.Header>
          <Modal.Body className={s.modal__body}>
            <p className={s.modal_text}>
              {t('email_verification_text', { email: $email })}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={s.btn}
              isShadow={true}
              label={t('Send')}
              onClick={sendMail}
            />
          </Modal.Footer>
        </Modal>
      </>
    )
  )
}
