import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, InputField, Select } from '../../..'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './EditServerModal.module.scss'

import { dedicOperations } from '../../../../Redux'
import { translatePeriod } from '../../../../utils'

export default function EditServerModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [currentIP, setCurrentIP] = useState()
  const [currentManagePanel, setCurrentManagePanel] = useState()

  const [currentOrder, setCurrentOrder] = useState('')

  const orderText = currentOrder?.$?.split('<br/>')
    ?.filter(item => item)
    ?.slice(1)

  let controlPanelText = orderText?.filter(item => item.includes('Control panel'))
  let ipAdressesText = orderText?.filter(item => item.includes('IP-addresses'))
  let totalAmountText = orderText?.filter(item => item.includes('Total amount'))

  let amountToPay =
    totalAmountText &&
    totalAmountText[0]
      ?.split(' ')
      ?.filter(item => !isNaN(item))
      .join('')

  const initialIP = initialState?.ipamount?.$
  const initialManagePanel = initialState?.managePanel

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dedicOperations.getCurrentDedicInfo(elid, setInitialState))
  }, [])

  const handleSubmit = values => {
    const {
      elid,
      autoprolong,
      domainname,
      ostempl,
      recipe,
      managePanel,
      managePanelName,
      ipTotal,
      ipName,
      ip,
      username,
      userpassword,
      password,
    } = values

    if (
      (initialIP !== currentIP && currentIP !== undefined) ||
      (initialManagePanel !== currentManagePanel &&
        currentManagePanel !== undefined &&
        currentManagePanel !== '97')
    ) {
      dispatch(
        dedicOperations.editDedicServer(
          elid,
          autoprolong,
          domainname,
          ostempl,
          recipe,
          managePanel,
          managePanelName,
          ipTotal,
          ipName,
          ip,
          username,
          userpassword,
          password,
          handleEditionModal,
        ),
      )
    } else {
      dispatch(
        dedicOperations.editDedicServerNoExtraPay(
          elid,
          autoprolong,
          domainname,
          ostempl,
          recipe,
          managePanel,
          managePanelName,
          ipTotal,
          ipName,
          ip,
          username,
          userpassword,
          password,
          handleEditionModal,
        ),
      )
    }
  }

  const validationSchema = Yup.object().shape({
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  return (
    <div className={s.modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Editing a service', { ns: 'other' })}</h2>
          <span className={s.order_id}>{`(#${initialState?.id?.$})`}</span>
        </div>
        <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
      </div>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          elid,
          domainname: initialState?.domain?.$ || '',
          ipTotal: initialState?.ipamount?.$ || null,
          price: null,
          autoprolong: initialState?.autoprolong?.$ || null,
          ostempl: initialState?.ostempl?.$ || null,
          recipe: initialState?.recipe?.$ || null,
          managePanel: initialState?.managePanel,
          managePanelName: initialState?.managePanelName || null,
          ipName: initialState?.amountIPName,
          ip: initialState?.ip?.$ || '',
          username: initialState?.username?.$ || '',
          userpassword: initialState?.userpassword?.$ || '',
          password: initialState?.password?.$ || '',
          pricelist: initialState?.pricelist?.$,
          period: initialState?.period?.$,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.parameters_block}>
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
                    <h5 className={s.main_title}>{`1. ${t('main', { ns: 'vds' })}`}</h5>
                    <div className={s.main_block}>
                      <div>
                        <Select
                          height={50}
                          value={values.autoprolong}
                          label={t('autoprolong')}
                          getElement={item => setFieldValue('autoprolong', item)}
                          isShadow
                          itemsList={initialState?.autoprolonglList?.map(el => {
                            const labelText = translatePeriod(el?.$, t)
                            return {
                              label: labelText,
                              value: el.$key,
                            }
                          })}
                          className={s.select}
                        />
                        <InputField
                          label={t('domain_name')}
                          name="domainname"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete
                          type="text"
                          value={values?.domainname}
                          disabled
                        />
                        <InputField
                          label={`${t('User name')}:`}
                          name="username"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete
                          type="text"
                          value={values?.username}
                          disabled
                        />

                        <Select
                          height={50}
                          getElement={item => setFieldValue('recipe', item)}
                          isShadow
                          label={t('recipe')}
                          value={values?.recipe}
                          placeholder={t('recipe_placeholder')}
                          itemsList={initialState?.recipelList
                            ?.filter(e => {
                              return e.$depend === values.ostempl
                            })
                            .map(el => {
                              return {
                                label:
                                  el.$ === '-- none --'
                                    ? t('recipe_placeholder')
                                    : t(el.$),
                                value: el.$key,
                              }
                            })}
                          className={s.select}
                          dropdownClass={s.dropdownClass}
                          disabled
                        />
                      </div>
                      <div>
                        <InputField
                          label={`${t('IP-address')}:`}
                          name="ip"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete
                          type="text"
                          value={values?.ip}
                          disabled
                        />
                        <InputField
                          label={`${t('Password')}:`}
                          name="password"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete
                          type="text"
                          value={values?.password}
                          disabled
                        />
                        <InputField
                          label={`${t('User password')}:`}
                          name="userpassword"
                          isShadow
                          className={s.input_field_wrapper}
                          inputClassName={s.input}
                          autoComplete
                          type="text"
                          value={values?.userpassword}
                          disabled
                        />

                        <Select
                          height={50}
                          getElement={item => {
                            setFieldValue('ostempl', item)
                            setFieldValue('recipe', 'null')
                          }}
                          isShadow
                          label={t('os')}
                          value={values?.ostempl}
                          itemsList={initialState?.ostemplList?.map(el => {
                            return { label: t(el.$), value: el.$key }
                          })}
                          className={s.select}
                          disabled
                        />
                      </div>
                    </div>

                    <h5 className={s.additional_title}>
                      {`2. ${t('additionally', { ns: 'vds' })}`}
                    </h5>
                    <div className={s.additional_block}>
                      <Select
                        height={50}
                        value={values?.managePanel}
                        getElement={item => {
                          setFieldValue('managePanel', item)
                          setCurrentManagePanel(item)
                          dispatch(
                            dedicOperations.updatePriceEditModal(
                              elid,
                              values.autoprolong,
                              values.domainname,
                              values.ostempl,
                              values.recipe,
                              item,
                              values.managePanelName,
                              values.ipTotal,
                              values.ipName,
                              values.ip,
                              values.username,
                              values.userpassword,
                              values.password,

                              currentOrder,
                              setCurrentOrder,
                            ),
                          )
                        }}
                        isShadow
                        label={t('manage_panel')}
                        itemsList={initialState?.managePanellList?.map(el => {
                          let labelText = el.$

                          if (labelText.includes('Without a license')) {
                            labelText = labelText.replace(
                              'Without a license',
                              t('Without a license'),
                            )
                          }

                          if (labelText.includes('per month')) {
                            labelText = labelText.replace('per month', t('per month'))
                          }

                          if (labelText.includes('Unlimited domains')) {
                            labelText = labelText.replace(
                              'Unlimited domains',
                              t('Unlimited domains'),
                            )
                          }

                          if (labelText.includes('domains')) {
                            labelText = labelText.replace('domains', t('domains'))
                          }

                          return { label: labelText, value: el.$key }
                        })}
                        className={s.select}
                      />

                      <Select
                        height={50}
                        value={values?.ipTotal}
                        getElement={item => {
                          setFieldValue('ipTotal', item)
                          setCurrentIP(item)
                          dispatch(
                            dedicOperations.updatePriceEditModal(
                              elid,
                              values.autoprolong,
                              values.domainname,
                              values.ostempl,
                              values.recipe,
                              values.managePanel,
                              values.managePanelName,
                              item,
                              values.ipName,
                              values.ip,
                              values.username,
                              values.userpassword,
                              values.password,

                              currentOrder,
                              setCurrentOrder,
                            ),
                          )
                        }}
                        isShadow
                        label={t('count_ip')}
                        itemsList={['1', '2'].map(el => {
                          return { label: el, value: el }
                        })}
                        className={s.select}
                        disabled={initialIP === '2'}
                      />
                    </div>
                  </div>
                </div>

                {((initialIP !== currentIP && currentIP !== undefined) ||
                  (initialManagePanel !== currentManagePanel &&
                    currentManagePanel !== undefined &&
                    currentManagePanel !== '97')) && (
                  <p className={s.total_amount}>
                    {`${t('topay')}:`}{' '}
                    <span className={s.price}>{`${Number(amountToPay).toFixed(
                      2,
                    )} EUR`}</span>
                  </p>
                )}

                {((initialIP !== currentIP && currentIP !== undefined) ||
                  (initialManagePanel !== currentManagePanel &&
                    currentManagePanel !== undefined &&
                    currentManagePanel !== '97')) && (
                  <p className={s.order_description}>
                    <p className={s.panel_order}>
                      {controlPanelText
                        ? controlPanelText[0]
                            ?.replaceAll(
                              'for order and then',
                              t('for order and then', { ns: 'vds' }),
                            )
                            ?.replaceAll('per month', t('per month'))
                        : null}
                    </p>

                    <p className={s.ipadresses_order}>
                      {ipAdressesText &&
                        ipAdressesText[0]
                          ?.replaceAll(
                            'for order and then',
                            t('for order and then', { ns: 'vds' }),
                          )
                          ?.replaceAll('per month', t('per month'))}
                    </p>
                  </p>
                )}
              </div>

              <div className={s.btns_wrapper}>
                {(initialIP !== currentIP && currentIP !== undefined) ||
                (initialManagePanel !== currentManagePanel &&
                  currentManagePanel !== undefined &&
                  currentManagePanel !== '97') ? (
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('to_order', { ns: 'other' })}
                    type="submit"
                  />
                ) : (
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
                    type="submit"
                  />
                )}

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
