import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Container } from '../../Components/'
import s from './SupportPage.module.scss'

export default function MainPage() {
  const { t } = useTranslation(['support', 'other'])
  // const dispatch = useDispatch()

  return (
    <Container>
      <div className={s.body}>
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('support')}</h1>
          <div className={s.filterBlock}>
            <div></div>
            <Button
              className={s.newTicketBtn}
              isShadow
              size="medium"
              label={t('new ticket')}
              type="button"
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
