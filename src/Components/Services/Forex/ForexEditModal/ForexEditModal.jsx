import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, InputField, Select } from '../../..'
import { useDispatch } from 'react-redux'
import { Copy, Cross } from '../../../../images'
import { Formik, Form } from 'formik'
import { forexOperations } from '../../../../Redux'
import { translatePeriod } from '../../../../utils'
import { CSSTransition } from 'react-transition-group'

import animations from './animations.module.scss'

import s from './ForexEditModal.module.scss'
import classNames from 'classnames'

export default function ForexEditModal({ elid, closeFn }) {
  const { t } = useTranslation([
    'dedicated_servers',
    'vds',
    'other',
    'crumbs',
    'affiliate_program',
  ])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [refLinkCopied, setRefLinkCopied] = useState(false)

  const refLinkEl = useRef(null)

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(forexOperations.getCurrentForexInfo(elid, setInitialState))
  }, [])

  const showPrompt = fn => {
    fn(true)

    setTimeout(() => {
      fn(false)
    }, 2000)
  }

  const handleCopyText = el => {
    if (el.current === refLinkEl.current) {
      showPrompt(setRefLinkCopied)
      navigator.clipboard.writeText(el.current.textContent)
    }
  }

  const handleSubmit = values => {
    const { elid, autoprolong, stored_method } = values
    dispatch(
      forexOperations.editForex(elid, autoprolong, stored_method, handleEditionModal),
    )
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        elid,
        autoprolong: initialState?.autoprolong?.$ || null,
        period: initialState?.period?.$,
        server_ip: initialState?.server_ip?.$ || '',
        server_hostname: initialState?.server_hostname?.$ || '',
        server_password: initialState?.server_password?.$ || '',
        server_user: initialState?.server_user?.$ || '',
        server_package: initialState?.serverPackageList[0]?.$ || '',
        url_rdp: initialState?.url_rdp?.$ || '',
        stored_method: initialState?.stored_method?.$ || '0',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form className={s.form}>
            <div className={s.parameters_block}>
              <div className={s.header_block}>
                <div className={s.title_wrapper}>
                  <h2 className={s.page_title}>
                    {t('Editing a service', { ns: 'other' })}
                  </h2>
                  <span className={s.order_id}>{`(#${initialState?.id?.$})`}</span>
                </div>
                <Cross
                  className={s.icon_cross}
                  onClick={closeFn}
                  width={17}
                  height={17}
                />
              </div>

              <div className={s.status_wrapper}>
                <div className={s.creation_date_wrapper}>
                  <span className={s.label}>{t('created', { ns: 'vds' })}:</span>
                  <span className={s.value}>{initialState?.createdate?.$}</span>
                </div>
                <div className={s.expiration_date_wrapper}>
                  <span className={s.label}>{t('valid_until', { ns: 'vds' })}:</span>
                  <span className={s.value}>{initialState?.expiredate?.$}</span>
                </div>
              </div>

              <div className={s.parameters_wrapper}>
                <div className={s.main_block}>
                  <div>
                    <Select
                      height={50}
                      value={values.autoprolong}
                      label={t('autoprolong')}
                      getElement={item => setFieldValue('autoprolong', item)}
                      isShadow
                      itemsList={initialState?.autoprolongList?.map(el => {
                        const labelText = translatePeriod(el?.$, t)
                        return {
                          label: labelText,
                          value: el.$key,
                        }
                      })}
                      className={s.select}
                      inputClassName={s.input_class}
                    />

                    <Select
                      height={50}
                      getElement={item => {
                        setFieldValue('stored_method', item)
                      }}
                      isShadow
                      label={`${t('Payment method', { ns: 'other' })}:`}
                      value={values?.stored_method}
                      itemsList={initialState?.paymentMethodList?.map(el => {
                        return { label: t(el.$), value: el.$key }
                      })}
                      className={s.select}
                      inputClassName={s.input_class}
                    />

                    <InputField
                      label={`${t('ip', { ns: 'crumbs' })}:`}
                      name="server_ip"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete
                      type="text"
                      value={values?.server_ip}
                      disabled
                    />
                    <InputField
                      label={`${t('Hostname', { ns: 'other' })}:`}
                      name="server_hostname"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete
                      type="text"
                      value={values?.server_hostname}
                      disabled
                    />
                  </div>
                  <div>
                    <InputField
                      label={`${t('user_name', { ns: 'vds' })}:`}
                      name="server_user"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete
                      type="text"
                      value={values?.server_user}
                      disabled
                    />
                    <InputField
                      label={`${t('Password')}:`}
                      name="server_password"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete
                      type="text"
                      value={values?.server_password}
                      disabled
                    />
                    <InputField
                      label={`${t('tariff', { ns: 'vds' })}:`}
                      name="server_package"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete
                      type="text"
                      value={values?.server_package}
                      disabled
                    />

                    <div className={s.field_wrapper}>
                      <label className={s.label}>
                        {`${t('Connection URL', { ns: 'other' })}`}:
                      </label>
                      <div
                        className={s.copy_field}
                        onClick={() => handleCopyText(refLinkEl)}
                        role="button"
                        tabIndex={0}
                        onKeyUp={() => {}}
                        data-testid={'ref_link_field'}
                      >
                        <span
                          className={classNames(s.field_text, {
                            [s.selected]: true,
                          })}
                          ref={refLinkEl}
                        >
                          {values?.url_rdp}
                        </span>
                        <Copy
                          className={classNames(s.copy_icon, {
                            [s.selected]: true,
                          })}
                        />

                        <CSSTransition
                          in={refLinkCopied}
                          classNames={animations}
                          timeout={150}
                          unmountOnExit
                        >
                          <div className={s.copy_prompt}>
                            <div className={s.prompt_pointer}></div>
                            {t('about_section.link_copied', { ns: 'affiliate_program' })}
                          </div>
                        </CSSTransition>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          </Form>
        )
      }}
    </Formik>
  )
}
