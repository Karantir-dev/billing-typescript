import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '@redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, InputField, Select, Modal } from '@components'
import { useLocation } from 'react-router-dom'
import s from './DedicIPOrder.module.scss'

export default function DedicIPOrder({ closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const location = useLocation()
  const ipPlid = location.state.plid

  const [initialValues, setInitialValues] = useState()

  const handleEditionModal = () => {
    closeFn()
  }

  const handleSubmit = values => {
    const { domain, ipAmout } = values

    dispatch(
      dedicOperations.orderNewIP(
        ipPlid,
        initialValues?.typeList[0]?.$name,
        initialValues?.maxcount?.$,
        ipAmout,
        domain,
        handleEditionModal,
      ),
    )
  }

  const maxIPAmountList = []
  for (let i = 1; i <= initialValues?.maxcount?.$; i++) {
    maxIPAmountList.push(i)
  }

  const validationSchema = Yup.object().shape({
    domain: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  useEffect(() => {
    dispatch(dedicOperations.orderIPInfo(ipPlid, setInitialValues))
  }, [])

  return (
    <Modal isOpen closeModal={closeFn} className={s.modal}>
      <Modal.Header>
        <h2 className={s.page_title}>
          {t('Add IP-address', { ns: 'dedicated_servers' })}
        </h2>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            domain: initialValues?.domain?.$ || '',
            ipType: initialValues?.typeList[0]?.$ || '',
            ipAmount: initialValues?.count?.$ || '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => {
            return (
              <Form id="ip-order">
                <div className={s.main_block}>
                  <InputField
                    label={`${t('type')}:`}
                    name="ipType"
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete="off"
                    type="text"
                    value={t(values?.ipType)}
                    disabled
                  />
                  <InputField
                    label={`${t('domain')}:`}
                    name="domain"
                    error={!!errors.domain}
                    touched={!!touched.domain}
                    isShadow
                    className={s.input_field_wrapper}
                    inputClassName={s.input}
                    autoComplete
                    type="text"
                    value={values?.domain}
                  />

                  <Select
                    height={50}
                    value={values?.ipAmount}
                    getElement={item => {
                      setFieldValue('ipAmount', item)
                    }}
                    isShadow
                    label={t('count_ip')}
                    itemsList={maxIPAmountList.map(el => {
                      return { label: el, value: el.toString() }
                    })}
                    className={s.select}
                  />
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
          label={t('Save', { ns: 'other' })}
          type="submit"
          form="ip-order"
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
      </Modal.Footer>
    </Modal>
  )
}
