import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../images'
import { cartActions, cartOperations } from '../../Redux'
import s from './Cart.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const { t } = useTranslation(['cart', 'other'])

  useEffect(() => {
    dispatch(cartOperations.getBasket())
  }, [])

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <span className={s.headerText}>{t('Payment')}</span>
          <Cross
            onClick={() => dispatch(cartActions?.setCartIsOpenedState(false))}
            className={s.crossIcon}
          />
        </div>
      </div>
    </div>
  )
}
