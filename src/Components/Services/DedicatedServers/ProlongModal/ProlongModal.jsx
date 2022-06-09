import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { Formik, Form } from 'formik'

import { Button } from '../../..'
import Select from '../../../ui/Select/Select'
import { translatePeriod } from '../EditServerModal/EditServerModal'
import s from './ProlongModal.module.scss'

export default function ProlongModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [newExpireDate, setNewExpireDate] = useState(initialState?.newexpiredate?.$)
  console.log(initialState?.newexpiredate?.$)

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dedicOperations.getProlongInfo(elid, setInitialState))
  }, [])

  useEffect(() => {
    setNewExpireDate(initialState?.newexpiredate?.$)
  }, [initialState])

  console.log(initialState?.slist)

  const handleSubmit = values => {
    const { period } = values

    dispatch(dedicOperations.payProlongPeriod(elid, period, handleEditionModal))
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        period: initialState?.period?.$.toString() || '',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        console.log(values)

        return (
          <Form className={s.form}>
            <div className={s.parameters_block}>
              <div className={s.header_block}>
                <div className={s.title_wrapper}>
                  <h2 className={s.page_title}>{t('Prolong service')}</h2>
                  <span className={s.tarif_name}>
                    {initialState?.title_name?.$.split('(')[0]}
                  </span>
                </div>

                <Cross
                  className={s.icon_cross}
                  onClick={closeFn}
                  width={12}
                  height={12}
                />
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
                      return {
                        label: translatePeriod(el?.$, t),
                        value: el.$key,
                      }
                    })}
                    className={s.select}
                  />
                </div>

                <div className={s.btns_wrapper}>
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
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
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
