import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import { Formik, Form } from 'formik'
import { Button, Select } from '../../..'

import s from './ProlongModal.module.scss'
import classNames from 'classnames'
import { replaceAllFn, translatePeriod } from '../../../../utils'

export default function ProlongModal({ elid, closeFn, pageName, names }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [newExpireDate, setNewExpireDate] = useState(initialState?.newexpiredate?.$)
  const [more, setMore] = useState(false)
  const [namesToRender, setNamesToRender] = useState(
    names?.length > 1 ? names?.slice(0, 1) : names,
  )

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    if (elid?.length > 1) {
      const elidToString = elid?.toString()
      const elidWithSpaces = replaceAllFn(elidToString, ',', ', ')

      dispatch(dedicOperations.getProlongInfoForFewElems(elidWithSpaces, setInitialState))
    } else {
      dispatch(dedicOperations.getProlongInfo(elid[0], setInitialState))
    }
  }, [])

  useEffect(() => {
    setNewExpireDate(initialState?.newexpiredate?.$)
  }, [initialState])

  const handleSubmit = values => {
    const { period } = values

    if (elid?.length > 1) {
      const elidToString = elid?.toString()
      const elidWithSpaces = replaceAllFn(elidToString, ',', ', ')

      dispatch(
        dedicOperations.payProlongPeriodFewElems(
          elidWithSpaces,
          period,
          handleEditionModal,
          pageName,
        ),
      )
    } else {
      dispatch(
        dedicOperations.payProlongPeriod(elid[0], period, handleEditionModal, pageName),
      )
    }
  }

  return (
    <div className={s.modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Prolong service')}</h2>
          <span className={s.tarif_name}>
            {!elid?.length > 1 &&
              initialState?.title_name?.$?.split(' (')[0]
                ?.replace('for', t('for', { ns: 'dns' }))
                ?.replace('domains', t('domains', { ns: 'dns' }))
                ?.replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
          </span>
        </div>

        <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          period: initialState?.period?.$?.toString() || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.parameters_block}>
                  {elid?.length === 1 ? (
                    <>
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
                    </>
                  ) : (
                    <div>
                      <p className={s.warning_text}>
                        {t('Attention, edit few services', { ns: 'other' })}:
                      </p>

                      <div className={more && s.services_names_wrapper}>
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
                        <button
                          onClick={e => {
                            e.preventDefault()
                            setMore(!more)
                            setNamesToRender(!more ? names : names?.slice(0, 1))
                          }}
                          className={s.hidden_area}
                        >
                          {!more
                            ? t('services_deletion', {
                                ns: 'other',
                                value: +names.length - 1,
                              })
                            : 'show less'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className={s.parameters_wrapper}>
                    <div className={s.main_block}>
                      <Select
                        height={50}
                        value={values.period}
                        label={`${t('Period', { ns: 'other' })}:`}
                        getElement={item => {
                          if (elid?.length === 1) {
                            dispatch(
                              dedicOperations.getUpdateProlongInfo(
                                elid[0],
                                item,
                                setNewExpireDate,
                              ),
                            )
                          }
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
