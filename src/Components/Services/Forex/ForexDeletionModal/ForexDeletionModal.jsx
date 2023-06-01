import { useTranslation } from 'react-i18next'

import { Cross } from '@images'

import { Button } from '../../..'

import s from './ForexDeletionModal.module.scss'
import { useDispatch } from 'react-redux'
import { forexOperations } from '@redux'
import classNames from 'classnames'

export default function ForexDeletionModal({ elid, closeFn, server }) {
  const { t } = useTranslation('other')

  const dispatch = useDispatch()

  return (
    <div className={s.modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Service deletion')}</h2>
        </div>

        <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
      </div>

      <div className={s.modal_content}>
        <p>{`${t('Are you sure you want to delete service')} ${server?.name?.$}?`}</p>
      </div>

      <div className={s.btns_wrapper}>
        <Button
          className={classNames({ [s.buy_btn]: true, [s.btn]: true })}
          isShadow
          size="medium"
          label={t('Proceed')}
          type="button"
          onClick={() => {
            dispatch(forexOperations.deleteForex(elid, closeFn))
          }}
        />

        <button
          onClick={() => {
            closeFn()
          }}
          className={s.cancel_btn}
        >
          {t('Cancel')}
        </button>
      </div>
    </div>
  )
}
