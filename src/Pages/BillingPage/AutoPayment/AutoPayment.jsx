import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../Components/'
import s from './AutoPayment.module.scss'

export default function Component() {
  //   const dispatch = useDispatch()
  const { t } = useTranslation(['billing', 'other'])

  useEffect(() => {}, [])

  const renderInstruction = () => {
    return (
      <>
        <div className={s.autoPayTitle}>{t('AutoPaymentText')}</div>
        <Button
          dataTestid={'back_btn'}
          size="large"
          className={s.configureBtn}
          label={t('Configure')}
          onClick={() => null}
          type="button"
        />
      </>
    )
  }

  return <div className={s.autoPayContainer}>{renderInstruction()}</div>
}
