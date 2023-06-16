import { useTranslation } from 'react-i18next'
import { Cross } from '@images'
import { Select, Button, InputField } from '../../..'
import { Formik, Form } from 'formik'
import s from './SharedHostingEditModal.module.scss'
import { translatePeriod, orderDetailTranslate } from '@utils'

export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other', 'domains', 'autoprolong'])

  const {
    name,
    closeEditModalHandler,
    editData,
    sendEditVhostHandler,
    editVhostHandler,
  } = props

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    sendEditVhostHandler(data)
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <div className={s.headerTitleBlock}>
          <span className={s.headerText}>{t('Service editing', { ns: 'domains' })}</span>
          <span className={s.vhostName}>({name})</span>
        </div>
        <Cross onClick={closeEditModalHandler} className={s.crossIcon} />
      </div>
      <div className={s.statusBlock}>
        <div className={s.statusItem}>
          <span>{t('service_created')}:</span>
          <span>{editData?.createdate}</span>
        </div>
        <div className={s.statusItem}>
          <span>{t('Service extended until')}:</span>
          <span>{editData?.expiredate}</span>
        </div>
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          ip: editData?.ip || '',
          domain: editData?.domain || '',
          autoprolong: editData?.autoprolong || '',
          stored_method: editData?.stored_method || '',

          username: editData?.username || '',
          password: editData?.password || '',
          nameserver1: editData?.nameserver1 || '',
          nameserver2: editData?.nameserver2 || '',
          nameserver3: editData?.nameserver3 || '',
          nameserver4: editData?.nameserver4 || '',
        }}
        onSubmit={editHandler}
      >
        {({ setFieldValue, values, errors, touched }) => {
          return (
            <Form className={s.form__wrapper}>
              <div className={s.form}>
                <div className={s.fieldsBlock}>
                  <Select
                    label={`${t('Auto renewal', { ns: 'domains' })}:`}
                    placeholder={t('Not selected')}
                    value={values.autoprolong}
                    getElement={item => {
                      setFieldValue('autoprolong', item)
                      editVhostHandler({ autoprolong: item })

                      setFieldValue(
                        'stored_method',
                        item && item !== 'null'
                          ? editData?.stored_method_list[0]?.$key
                          : null,
                      )
                    }}
                    isShadow
                    itemsList={editData?.autoprolong_list?.map(({ $key, $ }) => ({
                      label: translatePeriod($, t),
                      value: $key,
                    }))}
                    className={s.select}
                  />
                  {editData?.status !== '1' && (
                    <>
                      {values?.autoprolong && values?.autoprolong !== 'null' && (
                        <Select
                          label={`${t('Payment method', { ns: 'domains' })}:`}
                          placeholder={t('Not selected')}
                          value={values.stored_method}
                          getElement={item => setFieldValue('stored_method', item)}
                          isShadow
                          itemsList={editData?.stored_method_list?.map(({ $key, $ }) => ({
                            label: $.trim(),
                            value: $key,
                          }))}
                          className={s.select}
                        />
                      )}
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'ip'}
                        label={`${t('IP address')}:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.ip}
                        touched={!!touched.ip}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'domain'}
                        label={`${t('Domain name', { ns: 'domains' })}:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.domain}
                        touched={!!touched.domain}
                      />

                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'username'}
                        isRequired
                        label={`${t('Username')}:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.username}
                        touched={!!touched.username}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'password'}
                        label={`${t('Password')}:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.password}
                        touched={!!touched.password}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'nameserver1'}
                        label={`${t('Name Server')} 1:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.nameserver1}
                        touched={!!touched.nameserver1}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'nameserver2'}
                        label={`${t('Name Server')} 2:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.nameserver2}
                        touched={!!touched.nameserver2}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'nameserver3'}
                        label={`${t('Name Server')} 3:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.nameserver3}
                        touched={!!touched.nameserver3}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name={'nameserver4'}
                        label={`${t('Name Server')} 4:`}
                        isShadow
                        className={s.input}
                        disabled
                        error={!!errors.nameserver4}
                        touched={!!touched.nameserver4}
                      />
                    </>
                  )}

                  {editData?.status === '1' && (
                    <div
                      className={s.orderDetail}
                      dangerouslySetInnerHTML={{
                        __html: orderDetailTranslate(editData?.orderinfo, t),
                      }}
                    />
                  )}
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
      <div className={s.btnBlock}>
        <Button
          className={s.searchBtn}
          isShadow
          size="medium"
          label={t('Save', { ns: 'other' })}
          type="submit"
        />
        <button onClick={closeEditModalHandler} type="button" className={s.clearFilters}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </div>
    </div>
  )
}
