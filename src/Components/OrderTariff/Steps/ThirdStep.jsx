import { PayersList } from '@components'
import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors, payersOperations, payersSelectors } from '@redux'
import { OFFER_FIELD } from '@utils/constants'
import s from '../OrderTariff.module.scss'

export default function ThirdtStep({ passStep }) {
  const dispatch = useDispatch()

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersData = useSelector(payersSelectors.getPayersData)
  const payersList = useSelector(payersSelectors.getPayersList)
  const geoData = useSelector(authSelectors.getGeoData)

  const editPayerHandler = ({ profile, ...values }) => {
    let data = {
      country_physical: values?.country,
      sok: 'ok',
      elid: profile,
      ...values,
    }
    dispatch(payersOperations.getPayerEditInfo(data, true, passStep))
  }

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

  const submitFormHandler = values =>
    payersList?.length ? editPayerHandler(values) : createPayerHandler(values)

  return (
    <Formik
      enableReinitialize
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
        cnp: payersData.state?.cnp || payersData.selectedPayerFields?.cnp || '',
      }}
      onSubmit={submitFormHandler}
    >
      {() => (
        <Form id="payer" className={s.payer}>
          <PayersList />
        </Form>
      )}
    </Formik>
  )
}
