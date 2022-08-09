import React, { useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../../images'
import { Select, Button } from '../../..'
import { Formik, Form } from 'formik'
import s from './DomainsProlongModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const { names, closeProlongModalHandler, prolongData, prolongEditSiteCareHandler } =
    props

  const [more, setMore] = useState(false)
  const [namesToRender, setNamesToRender] = useState(
    names?.length > 1 ? names?.slice(0, 1) : names,
  )

  const editHandler = values => {
    const data = { ...values, sok: 'ok', clicked_button: 'basket' }
    prolongEditSiteCareHandler(data)
  }

  const handleMoreBtn = e => {
    e.preventDefault()
    setMore(!more)
    setNamesToRender(!more ? names : names?.slice(0, 1))
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <div className={s.headerTitleBlock}>
          <span className={s.headerText}>{t('Service extension')}</span>
        </div>
        <Cross onClick={closeProlongModalHandler} className={s.crossIcon} />
      </div>
      {prolongData?.domain_id?.split(',')?.length > 1 && (
        <div className={s.namesBlock}>
          <p className={s.warning_text}>
            {t('Attention, edit few services', { ns: 'other' })}:
          </p>

          <div
            className={cn({
              [s.services_names_wrapper]: true,
              [s.active]: more,
            })}
          >
            {namesToRender?.map((item, idx) => {
              return (
                <span className={s.item} key={item}>
                  {item
                    ?.split(' (')[0]
                    ?.replace('for', t('for', { ns: 'dns' }))
                    ?.replace('domains', t('domains', { ns: 'dns' }))
                    ?.replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}

                  {names.length <= 3 && idx === names.length - 1 ? '' : ', '}
                </span>
              )
            })}
          </div>
          {names?.length > 1 && (
            <button onClick={handleMoreBtn} className={s.hidden_area}>
              {!more
                ? t('and_more', {
                    ns: 'other',
                    value: +names.length - 1,
                  })
                : t('trusted_users.read_less', { ns: 'trusted_users' })}
            </button>
          )}
        </div>
      )}
      <div className={s.statusBlock}>
        <div className={s.statusItem}>
          <span>{t('status', { ns: 'other' })}:</span>
          <span
            className={cn(s.status, {
              [s.active]: prolongData?.status?.includes('2'),
              [s.disabled]:
                prolongData?.status?.includes('4') || prolongData?.status?.includes('3'),
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
  )
}
