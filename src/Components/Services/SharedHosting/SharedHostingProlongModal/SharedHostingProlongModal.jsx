import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Select, Button } from '../../..'
import { Formik, Form } from 'formik'
import s from './SharedHostingProlongModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const { name, closeProlongModalHandler, prolongData, prolongEditVhostHandler } = props

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    prolongEditVhostHandler(data)
  }

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <div className={s.headerTitleBlock}>
            <span className={s.headerText}>{t('Service extension')}</span>
            <span className={s.vhostName}>{name}</span>
          </div>
          <Cross onClick={closeProlongModalHandler} className={s.crossIcon} />
        </div>
        <div className={s.statusBlock}>
          <div className={s.statusItem}>
            <span>{t('status', { ns: 'other' })}:</span>
            <span
              className={cn(s.status, {
                [s.active]: prolongData?.status?.includes('2'),
                [s.disabled]:
                  prolongData?.status?.includes('4') ||
                  prolongData?.status?.includes('3'),
              })}
            >
              {prolongData && prolongData[`item_${prolongData?.status}`]}
            </span>
          </div>
          <div className={s.statusItem}>
            <span>{t('The service is active until')}:</span>
            <span>{prolongData?.expiredate}</span>
          </div>
          <div className={s.statusItem}>
            <span>{t('Service extended until')}:</span>
            <span>{prolongData?.newexpiredate}</span>
          </div>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            period: prolongData?.period || '',
          }}
          onSubmit={editHandler}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form className={s.form}>
                <div className={s.fieldsBlock}>
                  <Select
                    label={`${t('Period', { ns: 'other' })}:`}
                    placeholder={t('Not selected')}
                    value={values.period}
                    getElement={item => setFieldValue('period', item)}
                    isShadow
                    itemsList={prolongData?.period_list?.map(({ $key, $ }) => ({
                      label: t(`${$.trim()}`, { ns: 'other' }),
                      value: $key,
                    }))}
                    className={s.select}
                  />
                </div>

                <div className={s.btnBlock}>
                  <Button
                    className={s.searchBtn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
                    type="submit"
                  />
                  <button
                    onClick={closeProlongModalHandler}
                    type="button"
                    className={s.clearFilters}
                  >
                    {t('Cancel', { ns: 'other' })}
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
