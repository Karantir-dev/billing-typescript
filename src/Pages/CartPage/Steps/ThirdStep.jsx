import { PayersList } from '@components'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors, payersOperations, payersSelectors } from '@redux'
import { OFFER_FIELD } from '@utils/constants'
import s from '../CartPage.module.scss'

export default function ThirdtStep({ passStep }) {
  const { t } = useTranslation(['other'])
  const dispatch = useDispatch()

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersData = useSelector(payersSelectors.getPayersData)
  const payersList = useSelector(payersSelectors.getPayersList)
  const geoData = useSelector(authSelectors.getGeoData)

  const validationSchema = Yup.object().shape({
    person: Yup.string().required(t('Is a required field')),
    city_physical: Yup.string().required(t('Is a required field')),
    address_physical: Yup.string()
      .matches(/^[^@#$%^&*!~<>]+$/, t('symbols_restricted'))
      .matches(/(?=\d)/, t('address_error_msg'))
      .required(t('Is a required field')),
    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().required(t('Is a required field'))
        : null,
  })

  const createPayerHandler = values => {
    let data = {
      ...values,
      name: values?.name,
      clicked_button: 'finish',
      progressid: false,
      sok: 'ok',
      [OFFER_FIELD]: 'on',
    }

    if (window.fbq) window.fbq('track', 'AddPaymentInfo')

    if (values.profiletype && values.profiletype !== '1') {
      data.jobtitle = 'jobtitle'
      data.rdirector = 'rdirector'
      data.rjobtitle = 'rjobtitle'
      data.ddirector = 'ddirector'
      data.djobtitle = 'djobtitle'
      data.baseaction = 'baseaction'
    }
    dispatch(payersOperations.getPayerModalInfo(data, true, passStep))
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        profile:
          payersData.selectedPayerFields?.profile ||
          payersList?.[payersList?.length - 1]?.id?.$ ||
          '',
        name: payersData.state?.name || payersData.selectedPayerFields?.name || '',
        address_physical:
          payersData.state?.addressPhysical ??
          payersData.selectedPayerFields?.address_physical ??
          '',
        city_physical:
          payersData.state?.cityPhysical ??
          (payersData.selectedPayerFields?.city_physical || geoData?.clients_city || ''),
        person: payersData.state?.person ?? payersData.selectedPayerFields?.person ?? '',
        country:
          payersSelectedFields?.country || payersSelectedFields?.country_physical || '',
        profiletype:
          payersData.state?.profiletype ||
          payersData.selectedPayerFields?.profiletype ||
          payersSelectedFields?.profiletype,
        eu_vat: payersData.state?.euVat || payersData.selectedPayerFields?.eu_vat || '',
      }}
      onSubmit={createPayerHandler}
    >
      {() => (
        <Form id="payer" className={s.payer}>
          <PayersList />
        </Form>
      )}
    </Formik>
  )
}
