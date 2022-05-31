import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../Redux'
import { Cross } from '../../../images'
// import { Formik, Form } from 'formik'

import s from './EditModal.module.scss'

export default function EditModal({ elid, closeFn }) {
  const { t } = useTranslation(['vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  console.log(initialState)
  useEffect(() => {
    dispatch(vdsOperations.editVDS(elid, setInitialState))
  }, [])

  return (
    <div className={s.modal}>
      <div className={s.title_wrapper}>
        <p className={s.title}>
          {t('edit_title')}
          <span className={s.tariff_name}>{initialState?.name.$.split('(')[0]}</span>
        </p>

        <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
      </div>

      <div className={s.dates_wrapper}>
        <p>
          {t('created')}: <span className={s.date}>{initialState?.opendate.$}</span>
        </p>
        <p>
          {t('valid_until')}: <span className={s.date}>{initialState?.expiredate.$}</span>
        </p>
      </div>
      <p className={s.chapter_title}>1. {t('main')}</p>

      {/* <Formik initialValues={{}} onSubmit={() => {}}>
        {({ setFormikState }) => {
          return <Form></Form>
        }}
      </Formik> */}
    </div>
  )
}
