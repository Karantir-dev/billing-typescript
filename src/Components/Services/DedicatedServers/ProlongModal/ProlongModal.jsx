import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import { Formik, Form } from 'formik'
import { Button, Select } from '../../..'

import s from './ProlongModal.module.scss'
import classNames from 'classnames'
import { translatePeriod } from '../../../../utils'

export default function ProlongModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [newExpireDate, setNewExpireDate] = useState(initialState?.newexpiredate?.$)

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dedicOperations.getProlongInfo(elid, setInitialState))
  }, [])

  useEffect(() => {
    setNewExpireDate(initialState?.newexpiredate?.$)
  }, [initialState])

  const handleSubmit = values => {
    const { period } = values

    dispatch(dedicOperations.payProlongPeriod(elid, period, handleEditionModal))
  }

  console.log(initialState?.title_name?.$.split('(')[0])

  return (
    <div className={s.modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Prolong service')}</h2>
          <span className={s.tarif_name}>
            {initialState?.title_name?.$.split('(')[0]
              .replace('for', t('for', { ns: 'dns' }))
              .replace('domains', t('domains', { ns: 'dns' }))
              .replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
          </span>
        </div>

        <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          period: initialState?.period?.$.toString() || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.parameters_block}>
                  <div className={s.first_row}>
                    <span className={s.label}>{t('status', { ns: 'other' })}:</span>
                    <span
                      className={classNames({
                        [s.value]: true,
                        [s.green]: initialState?.status?.$ === 'status_2',
                        [s.red]: initialState?.status?.$ !== 'status_2',
                      })}
                    >
                      {initialState?.status?.$ === 'status_2'
                        ? t('Active')
                        : t('Inactive')}
                    </span>
                  </div>
                  <div className={s.first_row}>
                    <span className={s.label}>{t('Service active until')}:</span>
                    <span className={s.value}>{initialState?.expiredate?.$}</span>
                  </div>
                  <div className={s.second_row}>
                    <span className={s.label}>{t('Service extended until')}:</span>
                    <span className={s.value}>{newExpireDate}</span>
                  </div>

                  <div className={s.parameters_wrapper}>
                    <div className={s.main_block}>
                      <Select
                        height={50}
                        value={values.period}
                        label={`${t('Period', { ns: 'other' })}:`}
                        getElement={item => {
                          dispatch(
                            dedicOperations.getUpdateProlongInfo(
                              elid,
                              item,
                              setNewExpireDate,
                            ),
                          )
                          setFieldValue('period', item)
                        }}
                        isShadow
                        itemsList={initialState?.slist[0]?.val?.map(el => {
                          const labelText = translatePeriod(el?.$, t)
                          return {
                            label: labelText,
                            value: el.$key,
                          }
                        })}
                        className={s.select}
                        inputClassName={s.inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.btns_wrapper}>
                <Button
                  className={s.buy_btn}
                  isShadow
                  size="medium"
                  label={t('Proceed', { ns: 'other' })}
                  type="submit"
                />

                <button
                  onClick={e => {
                    e.preventDefault()
                    closeFn()
                  }}
                  className={s.cancel_btn}
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
