import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { billingActions, dedicOperations } from '@redux'
import { Formik, Form } from 'formik'
import { Button, Select, Modal } from '@components'

import s from './ProlongModal.module.scss'
import classNames from 'classnames'
import { translatePeriod } from '@utils'

export default function ProlongModal({ elidList, closeModal, pageName, names, isOpen }) {
  const { t } = useTranslation([
    'dedicated_servers',
    'vds',
    'other',
    'trusted_users',
    'autoprolong',
  ])

  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [newExpireDate, setNewExpireDate] = useState(initialState?.newexpiredate?.$)
  const [more, setMore] = useState(false)
  const [namesToRender, setNamesToRender] = useState(
    names?.length > 1 ? names?.slice(0, 1) : names,
  )

  const handleEditionModal = () => {
    closeModal()
  }

  useEffect(() => {
    if (elidList?.length > 1) {
      dispatch(
        dedicOperations.getProlongInfoForFewElems(elidList.join(', '), setInitialState),
      )
    } else {
      dispatch(
        dedicOperations.getProlongInfo(elidList[0], setInitialState, pageName === 'vds'),
      )
    }
  }, [])

  useEffect(() => {
    setNewExpireDate(initialState?.newexpiredate?.$)
  }, [initialState])

  const handleSubmit = values => {
    const { period } = values

    let withSale = false

    if (pageName === 'vds') {
      dispatch(billingActions.setPeriodValue(period))
    }

    if (elidList?.length > 1) {
      dispatch(
        dedicOperations.payProlongPeriodFewElems(
          elidList.join(', '),
          period,
          handleEditionModal,
          pageName,
        ),
      )
    } else {
      dispatch(
        dedicOperations.payProlongPeriod(
          elidList[0],
          period,
          handleEditionModal,
          pageName,
          withSale,
        ),
      )
    }
  }

  const handleMoreBtn = e => {
    e.preventDefault()
    setMore(!more)
    setNamesToRender(!more ? names : names?.slice(0, 1))
  }

  const translateFeeText = period => {
    const feeAmount = initialState?.slist
      .find(el => el.$name === 'period')
      ?.val.find(el => el.$key === period)
      ?.$.match(/(.+?)(?= EUR)/)?.[1]

    let translate = t('Late fee will be charged to the expired service', {
      value: t(+feeAmount),
      ns: 'dedicated_servers',
    })

    return translate
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className={s.modal} noScroll>
      <Modal.Header>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Prolong service')}</h2>
          <span className={s.tarif_name}>
            {!elidList?.length > 1 &&
              initialState?.title_name?.$?.split(' (')[0]
                ?.replace('for', t('for', { ns: 'dns' }))
                ?.replace('domains', t('domains', { ns: 'dns' }))
                ?.replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}
          </span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={{
            period: initialState?.period?.$?.toString() || '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form id="prolong">
                <div className={s.parameters_block}>
                  {elidList?.length <= 1 ? (
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

                      <div
                        className={classNames({
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

                  {initialState?.suspendpenaltywarn && (
                    <p className={s.suspendpenaltywarn}>
                      {translateFeeText(values.period)}
                    </p>
                  )}

                  <div className={s.parameters_wrapper}>
                    <div className={s.main_block}>
                      <Select
                        height={50}
                        value={values.period}
                        label={`${t('Period', { ns: 'other' })}:`}
                        getElement={item => {
                          if (elidList?.length <= 1) {
                            dispatch(
                              dedicOperations.getUpdateProlongInfo(
                                elidList[0],
                                item,
                                setNewExpireDate,
                              ),
                            )
                          }
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
                        inputClassName={s.inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer column>
        <Button
          className={s.buy_btn}
          isShadow
          size="medium"
          label={t('Proceed', { ns: 'other' })}
          type="submit"
          form="prolong"
        />

        <button
          onClick={e => {
            e.preventDefault()
            closeModal()
          }}
          className={s.cancel_btn}
        >
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
