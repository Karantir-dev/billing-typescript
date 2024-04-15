import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, InputField, Select, Modal } from '@components'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './EditServerModal.module.scss'

import { dedicOperations } from '@redux'
import { isDisabledDedicTariff, translatePeriodText, roundToDecimal } from '@utils'

export default function EditServerModal({
  elid,
  closeModal,
  isOpen,
  signal,
  setIsLoading,
}) {
  const { t } = useTranslation([
    'dedicated_servers',
    'vds',
    'other',
    'crumbs',
    'autoprolong',
  ])
  const dispatch = useDispatch()
  const [parameters, setParameters] = useState()
  const [isFirstFetch, setIsFirstFetch] = useState(true)
  const [ipSelectDisabled, setIsIpListDisabled] = useState(false)
  
  useEffect(() => {
    dispatch(dedicOperations.getCurrentDedicInfo(elid, {}, setParameters))
  }, [])

  useEffect(() => {
    if (parameters && isFirstFetch) {
      if (parameters.IP_addresses_count === '2') {
        setIsIpListDisabled(true)
      }
      setIsFirstFetch(false)
    }
  }, [parameters])

  const changeFieldHandler = (field, value, isUpdatePrice) => {
    if (!isUpdatePrice) {
      setParameters(params => ({ ...params, [field]: value }))
      return
    }

    const { register, ostempl, recipe, domain, server_name } = parameters

    const params = {
      elid,
      ostempl: ostempl?.$,
      recipe: recipe?.$,
      autoprolong: parameters.autoprolong.$,
      domain: domain?.$,
      server_name: server_name?.$,
    }

    for (const key in register) {
      params[register[key]] = key === field ? value : parameters[key]
    }

    dispatch(dedicOperations.getCurrentDedicInfo(elid, params, setParameters))
  }

  const getOptionsListExtended = fieldName => {
    if (parameters && parameters.slist) {
      const optionsList = parameters.slist.find(elem => elem.$name === fieldName)?.val
      let firstItem = 0

      return optionsList
        ?.filter(el => el?.$)
        ?.map(({ $key, $, $cost }, index) => {
          let label = ''
          let withSale = false
          let words = []

          const labelText = $?.replaceAll(
            'unlimited traffic',
            t('unlimited traffic', { ns: 'dedicated_servers' }),
          )
            .replaceAll('Without a license', t('Without a license'))
            .replaceAll('Unlimited domains', t('Unlimited domains'))
            .replaceAll('domains', t('domains'))

          if (fieldName === 'Memory') {
            words = labelText?.match(/[\d|.|\\+]+/g)

            if (words?.length > 0 && index === 0) {
              firstItem = words[0]
            }

            if (words?.length > 0 && Number(words[0]) === firstItem * 2) {
              withSale = true
            }
          }

          if (withSale && words?.length > 0) {
            label = (
              <span className={s.selectWithSale}>
                <div className={s.sale55Icon}>-55%</div>
                <span className={s.saleSpan}>
                  {`${words[0]} Gb (`}
                  <span className={s.memorySale}>
                    {roundToDecimal(Number($cost / 0.45))}
                  </span>
                  {translatePeriodText(labelText.trim().split('(')[1], t)}
                </span>
              </span>
            )
          } else if (fieldName === 'Memory' || labelText.includes('EUR ')) {
            label = translatePeriodText(labelText.trim(), t)
          } else {
            label = t(labelText.trim())
          }

          return {
            value: $key,
            label: label,
            sale: withSale,
            newPrice: roundToDecimal(Number($cost)),
            oldPrice: roundToDecimal(Number($cost) + $cost * 0.55),
          }
        })
    }
    return []
  }

  const handleEditionModal = () => {
    closeModal()
  }

  const handleSubmit = values => {
    const {
      elid,
      autoprolong,
      domainname,
      ostempl,
      recipe,
      managePanel,
      ipTotal,
      ip,
      username,
      userpassword,
      password,
      server_name,
      Port_speed,
    } = values

    if (parameters?.orderinfo?.$) {
      dispatch(
        dedicOperations.editDedicServer(
          elid,
          autoprolong,
          domainname,
          ostempl,
          recipe,
          managePanel,
          parameters.register.Control_panel,
          ipTotal,
          parameters.register.IP_addresses_count,
          ip,
          username,
          userpassword,
          password,
          server_name,
          Port_speed,
          parameters.register.Port_speed,
          handleEditionModal,
        ),
      )
    } else {
      dispatch(
        dedicOperations.editDedicServerNoExtraPay({
          elid,
          autoprolong,
          domain: domainname,
          ostempl,
          recipe,
          managePanel,
          managePanelName:  parameters.register.Control_panel,
          ipTotal,
          ipName: parameters.register.IP_addresses_count,
          ip,
          username,
          userpassword,
          password,
          server_name,
          Port_speed,
          PortSpeedName: parameters.register.Port_speed,
          handleModal: handleEditionModal,
          signal,
          setIsLoading,
        }),
      )
    }
  }

  const validationSchema = Yup.object().shape({
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  const isProlongDisabled = isDisabledDedicTariff(parameters?.name?.$)

  const renderOrderDetail = () => {
    const orderText = parameters?.orderinfo?.$?.split('<br/>')
      ?.filter(item => item)
      ?.slice(1)

    const controlPanelText = orderText?.find(item => item.includes('Control panel'))
    const ipAdressesText = orderText?.find(item => item.includes('IP-addresses'))
    const portSpeedText = orderText?.find(item => item.includes('Port speed'))
    const totalAmountText = orderText?.find(item => item.includes('Total amount'))

    const amountToPay =
      totalAmountText &&
      totalAmountText
        ?.split(' ')
        ?.filter(item => !isNaN(item))
        .join('')

    return (
      <>
        <p className={s.total_amount}>
          {`${t('topay')}:`}{' '}
          <span className={s.price}>{`${roundToDecimal(amountToPay)} EUR`}</span>
        </p>

        <div className={s.order_description}>
          <p className={s.panel_order}>
            {controlPanelText
              ? controlPanelText
                  ?.replaceAll(
                    'for order and then',
                    t('for order and then', { ns: 'vds' }),
                  )
                  .replaceAll('per month', t('per month'))
                  .replaceAll('Without a license', t('Without a license'))
                  .replaceAll('domains', t('domains'))
                  .replaceAll('Control panel', t('manage_panel'))
              : null}
          </p>

          <p className={s.ipadresses_order}>
            {ipAdressesText &&
              ipAdressesText
                ?.replaceAll('for order and then', t('for order and then', { ns: 'vds' }))
                .replaceAll('per month', t('per month'))
                .replaceAll('IP-addresses count', t('IP-addresses count'))
                .replaceAll('Unit', t('Unit'))
                .replaceAll('additional', t('additional'))}
          </p>
          <p>
            {portSpeedText &&
              portSpeedText
                ?.replaceAll('for order and then', t('for order and then', { ns: 'vds' }))
                .replaceAll('unlimited traffic', t('unlimited traffic'))
                .replaceAll('per month', t('per month'))
                .replaceAll('Port speed', t('port_speed'))}
          </p>
        </div>
      </>
    )
  }

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} className={s.modal}>
      <Modal.Header>
        <h2 className={s.page_title}>{t('Editing a service', { ns: 'other' })}</h2>
        <span className={s.order_id}>{`(#${parameters?.id?.$})`}</span>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            elid,
            domainname: parameters?.domain?.$ || '',
            ipTotal: parameters?.IP_addresses_count || null,
            price: null,
            autoprolong: isProlongDisabled ? 'null' : parameters?.autoprolong?.$ || null,
            ostempl: parameters?.ostempl?.$ || null,
            recipe: parameters?.recipe?.$ || null,
            managePanel: parameters?.Control_panel,
            ip: parameters?.ip?.$ || '',
            username: parameters?.username?.$ || '',
            userpassword: parameters?.userpassword?.$ || '',
            password: parameters?.password?.$ || '',
            pricelist: parameters?.pricelist?.$,
            period: parameters?.period?.$,
            server_name: parameters?.server_name?.$,
            Port_speed: parameters?.Port_speed,
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form id={elid}>
                <div className={s.status_wrapper}>
                  <div className={s.creation_date_wrapper}>
                    <span className={s.label}>{t('created', { ns: 'vds' })}:</span>
                    <span className={s.value}>{parameters?.createdate?.$}</span>
                  </div>
                  <div className={s.expiration_date_wrapper}>
                    <span className={s.label}>{t('valid_until', { ns: 'vds' })}:</span>
                    <span className={s.value}>{parameters?.expiredate?.$}</span>
                  </div>
                </div>

                <h5 className={s.main_title}>{`1. ${t('main', {
                  ns: 'vds',
                })}`}</h5>
                <div className={s.main_block}>
                  <div>
                    <Select
                      height={50}
                      value={values.autoprolong}
                      label={t('autoprolong')}
                      getElement={item => changeFieldHandler('autoprolong', { $: item })}
                      isShadow
                      itemsList={getOptionsListExtended('autoprolong')}
                      className={s.select}
                      disabled={isProlongDisabled}
                    />
                    <InputField
                      label={t('domain_name')}
                      name="domainname"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete="off"
                      type="text"
                      value={values?.domainname}
                      disabled
                    />

                    <InputField
                      label={t('server_name')}
                      name="server_name"
                      placeholder={`${t('server_placeholder')}`}
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete="off"
                      type="text"
                      value={values?.server_name}
                    />

                    <InputField
                      label={`${t('user_name', { ns: 'vds' })}:`}
                      name="username"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete="off"
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
                      itemsList={parameters?.slist
                        .find(el => el.$name === 'recipe')
                        ?.val?.filter(e => {
                          return e.$depend === values.ostempl
                        })
                        .map(el => {
                          return {
                            label:
                              el.$ === '-- none --' ? t('recipe_placeholder') : t(el.$),
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
                      label={`${t('ip', { ns: 'crumbs' })}:`}
                      name="ip"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete="off"
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
                      autoComplete="off"
                      type="text"
                      value={values?.password}
                      disabled
                    />
                    <InputField
                      label={`${t('user_password', { ns: 'vds' })}:`}
                      name="userpassword"
                      isShadow
                      className={s.input_field_wrapper}
                      inputClassName={s.input}
                      autoComplete="off"
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
                      itemsList={getOptionsListExtended('ostempl')}
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
                    getElement={item => changeFieldHandler('Control_panel', item, true)}
                    isShadow
                    label={t('manage_panel')}
                    itemsList={getOptionsListExtended('Control_panel')}
                    className={s.select}
                  />

                  <Select
                    height={50}
                    value={values?.ipTotal}
                    getElement={item =>
                      changeFieldHandler('IP_addresses_count', item, true)
                    }
                    isShadow
                    label={t('count_ip')}
                    itemsList={parameters?.ipList?.map(el => {
                      return {
                        label: `${el?.value}
                          ${t('pcs.', {
                            ns: 'vds',
                          })}
                          (${roundToDecimal(el?.cost)} EUR)`,
                        value: el?.value?.toString(),
                      }
                    })}
                    className={s.select}
                    disabled={ipSelectDisabled}
                  />
                  {values.Port_speed && (
                    <Select
                      className={s.select}
                      value={values.Port_speed}
                      itemsList={getOptionsListExtended('Port_speed')}
                      getElement={value => changeFieldHandler('Port_speed', value, true)}
                      label={`${t('port_speed')}:`}
                      isShadow
                    />
                  )}
                </div>
                {parameters?.orderinfo?.$ && renderOrderDetail()}
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        {parameters?.orderinfo?.$ ? (
          <Button
            className={s.buy_btn}
            isShadow
            size="medium"
            label={t('to_order', { ns: 'other' })}
            type="submit"
            form={elid}
          />
        ) : (
          <Button
            className={s.buy_btn}
            isShadow
            size="medium"
            label={t('Save', { ns: 'other' })}
            type="submit"
            form={elid}
          />
        )}

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
