import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../../Redux'
import { Cross, ArrowSign } from '../../../../images'
import { Formik, Form } from 'formik'
import cn from 'classnames'

import s from './EditModal.module.scss'
import InputField from '../../../ui/InputField/InputField'
import { Select, Button } from '../../..'

export default function EditModal({ elid, closeFn, getVDSHandler }) {
  const { t } = useTranslation(['vds', 'other', 'billing'])
  const dispatch = useDispatch()
  const addOnsEl = useRef(null)

  const [initialState, setInitialState] = useState()
  const [isAddOnsOpened, setIsAddOnsOpened] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    dispatch(vdsOperations.getEditFieldsVDS(elid, setInitialState))
  }, [])

  const translatePeriodText = sentence => {
    const labelArr = sentence.split('EUR ')

    return (
      labelArr[0] +
      'EUR ' +
      t(labelArr[1].replace(')', '')) +
      (sentence.includes(')') ? ')' : '')
    )
  }

  const getControlPanelList = fieldName => {
    const optionsList = initialState.slist.find(elem => elem.$name === fieldName)?.val

    return optionsList?.map(({ $key, $ }) => {
      let label = translatePeriodText($.trim())

      label = t(label.split(' (')[0]) + ' (' + label.split(' (')[1]
      return { value: $key, label: label }
    })
  }

  const getOptionsListExtended = fieldName => {
    if (!initialState || initialState?.slist?.length === 0) {
      return [{ value: '', label: '' }]
    }

    let optionsList = []

    if (initialState?.slist?.find(elem => elem.$name === fieldName)) {
      optionsList = initialState?.slist?.find(elem => elem.$name === fieldName)?.val
    }

    if (fieldName === 'autoprolong' && !optionsList.find(el => el.$key === 'null')) {
      optionsList.unshift({ $key: 'null', $: 'Disabled' })
    }

    return optionsList
      .filter(el => el?.$)
      .map(({ $key, $ }) => {
        let label = ''

        if ($.includes('EUR ')) {
          label = translatePeriodText($.trim())
        } else {
          label = t($.trim())
        }
        return { value: $key, label: label }
      })
  }

  const getOptionsList = fieldName => {
    const optionsList = initialState?.slist?.find(elem => elem.$name === fieldName)?.val

    if (optionsList) {
      return optionsList
        .filter(el => el?.$)
        .map(({ $key, $ }) => ({ value: $key, label: t($.trim()) }))
    }
  }

  const handleAddOnsClick = () => {
    if (isAddOnsOpened) {
      addOnsEl.current.style.height = 0
      addOnsEl.current.style.overflow = 'hidden'
    } else {
      addOnsEl.current.style.height = addOnsEl.current.scrollHeight + 'px'
      addOnsEl.current.style.overflow = 'initial'
    }

    setIsAddOnsOpened(!isAddOnsOpened)
  }

  const mutateOptionsListData = list => {
    initialState.slist.forEach(el => {
      if (el.$name === 'autoprolong') {
        el.val = list
      }
    })

    setInitialState({ ...initialState })
  }

  const handleFormSubmit = values => {
    const mutatedValues = { ...values, clicked_button: orderInfo ? 'basket' : 'ok' }
    dispatch(
      vdsOperations.editVDS(
        elid,
        mutatedValues,
        initialState.register,
        null,
        null,
        null,
        getVDSHandler,
      ),
    )
    closeFn()
  }

  const orderDescMonthPart = orderInfo?.description.match(/(per .+?)(?=\))/g)

  const translatedDescription = orderInfo?.description
    .replace('for order and then', t('for order and then'))
    .replace(/(per .+?)(?=\))/g, t(orderDescMonthPart))

  return initialState ? (
    <div className={s.modal}>
      <div className={s.title_wrapper}>
        <p className={s.title}>
          {t('edit_title')}
          <span className={s.tariff_name}>{initialState?.name?.$.split('(')[0]}</span>
        </p>
        <button className={s.icon_cross} onClick={closeFn} type="button">
          <Cross width={17} height={17} />
        </button>
      </div>

      <div className={s.dates_wrapper}>
        <p className={s.date_line}>
          {t('created')}: <span className={s.date}>{initialState?.opendate?.$}</span>
        </p>
        <p className={s.date_line}>
          {t('valid_until')}:{' '}
          <span className={s.date}>{initialState?.expiredate?.$}</span>
        </p>
      </div>

      <p className={s.chapter_title}>1. {t('main')}</p>

      <Formik
        initialValues={{
          autoprolong: initialState?.autoprolong?.$,
          stored_method: initialState?.stored_method?.$,
          domainName: initialState?.domain?.$,
          userName: initialState?.username?.$,
          serverid: initialState?.serverid?.$,
          preinstalledSoft:
            initialState?.recipe?.$ === 'null' || !initialState?.recipe?.$
              ? t('not_installed')
              : initialState?.recipe?.$,
          IP: initialState?.ip?.$,
          password: initialState?.password?.$,
          userpassword: initialState?.userpassword?.$,
          ostempl: initialState?.ostempl?.$,
          Control_panel: initialState?.Control_panel,
          processors: initialState?.CPU_count,
          diskSpace: initialState?.Disk_space,
          portSpeed:
            initialState?.slist?.length > 0
              ? initialState?.slist?.find(el => el.$name === 'Port_speed')?.val[0]?.$
              : '',
          memory: initialState?.Memory,
          IPcount: initialState?.IP_addresses_count,
          server_name: initialState?.server_name?.$ || '',
        }}
        onSubmit={handleFormSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.grid_fields}>
                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.autoprolong}
                    getElement={value => {
                      setFieldValue('autoprolong', value)
                      dispatch(
                        vdsOperations.getEditFieldsVDS(elid, setInitialState, value),
                      )

                      if (value === 'null') {
                        setFieldValue('stored_method', null)
                      }
                    }}
                    itemsList={getOptionsListExtended('autoprolong')}
                    label={`${t('autoprolong')}:`}
                    isShadow
                  />

                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.stored_method}
                    getElement={value => setFieldValue('stored_method', value)}
                    itemsList={getOptionsList('stored_method')}
                    label={`${t('payment_method')}:`}
                    isShadow
                    disabled={values.autoprolong === 'null'}
                    placeholder={t('Select a Payment Method', { ns: 'billing' })}
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="domainName"
                    label={`${t('domain_name')}:`}
                    isShadow
                    disabled
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="server_name"
                    value={values?.server_name}
                    label={`${t('server_name')}:`}
                    placeholder={`${t('server_placeholder')}`}
                    isShadow
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="userName"
                    label={`${t('user_name')}:`}
                    isShadow
                    disabled
                  />
                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="serverid"
                    label={`${t('name')}:`}
                    isShadow
                    disabled
                  />
                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="preinstalledSoft"
                    label={`${t('preinstalled_soft')}:`}
                    isShadow
                    disabled
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="IP"
                    label={`${t('ip_address')}:`}
                    isShadow
                    disabled
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="password"
                    label={`${t('password')}:`}
                    isShadow
                    disabled
                  />
                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="userpassword"
                    label={`${t('user_password')}:`}
                    isShadow
                    disabled
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="ostempl"
                    label={`${t('ostempl')}:`}
                    isShadow
                    disabled
                  />
                </div>

                <button
                  className={cn(s.chapter_btn, s.mt)}
                  type="button"
                  onClick={handleAddOnsClick}
                >
                  2. {t('additionally')}{' '}
                  <ArrowSign
                    className={cn(s.arrow_icon, { [s.opened]: isAddOnsOpened })}
                  />
                </button>

                <div ref={addOnsEl} className={cn(s.add_ons_wrapper, s.grid_fields)}>
                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.Control_panel}
                    getElement={value => {
                      setFieldValue('Control_panel', value)

                      dispatch(
                        vdsOperations.editVDS(
                          elid,
                          { ...values, Control_panel: value },
                          initialState.register,
                          initialState.register.Control_panel,
                          mutateOptionsListData,
                          setOrderInfo,
                        ),
                      )
                    }}
                    itemsList={getControlPanelList('Control_panel')}
                    label={`${t('license')}:`}
                    isShadow
                  />

                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.processors}
                    getElement={value => setFieldValue('processors', value)}
                    itemsList={getOptionsListExtended('CPU_count')}
                    label={`${t('processors')}:`}
                    isShadow
                    disabled={true}
                  />

                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.diskSpace}
                    getElement={value => setFieldValue('diskSpace', value)}
                    itemsList={getOptionsListExtended('Disk_space')}
                    label={`${t('disk_space')}:`}
                    isShadow
                    disabled={initialState?.change_disc_size?.$ === 'off'}
                  />

                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="portSpeed"
                    label={`${t('port_speed')}:`}
                    isShadow
                    disabled
                  />

                  <Select
                    className={s.mb}
                    inputClassName={s.bgc}
                    value={values.memory}
                    getElement={value => setFieldValue('memory', value)}
                    itemsList={getOptionsListExtended('Memory')}
                    label={`${t('memory')}:`}
                    isShadow
                    disabled={true}
                  />
                  <InputField
                    className={s.mb}
                    inputClassName={s.bgc}
                    name="IPcount"
                    label={`${t('IPcount')}:`}
                    isShadow
                    disabled
                  />
                </div>

                {orderInfo && (
                  <>
                    <p className={s.total_amount}>
                      {t('total_amount')}:{' '}
                      <span className={s.price}>{orderInfo.price} EUR</span>
                    </p>
                    <p className={s.description}>{translatedDescription}</p>
                  </>
                )}
              </div>

              <div className={s.btnBlock}>
                <Button
                  className={s.btn_save}
                  type="submit"
                  isShadow
                  label={
                    orderInfo ? t('buy', { ns: 'other' }) : t('Save', { ns: 'other' })
                  }
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  ) : (
    <></>
  )
}
