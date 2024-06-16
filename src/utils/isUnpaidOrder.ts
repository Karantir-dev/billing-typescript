import { billingOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
export default function isUnpaidOrder(item: { id: { $: any }; item_status: { $orig: string } }, list: any[]) {
  const { t } = useTranslation(['billing'])
  const dispatch = useDispatch()

  const regex = /#pfx\/(\d+)/
  const isUnpaid = list?.find((el: { item_id: { $: any } }) => el.item_id.$ === item?.id.$)

  if (!isUnpaid || item?.item_status?.$orig !== '1') return { hidden: true }

  const match = isUnpaid?.desc.$.match(regex)
  const payItemHandler = () => {
    const values = {
      id: match[1],
      number: '',
      sender: '',
      sender_id: '',
      recipient: '',
      paymethod: '',
      status: '',
      createdate: 'nodate',
      createdatestart: '',
      createdateend: '',
      saamount_from: '',
      saamount_to: '',
      p_cnt: 1,
    }
    dispatch(billingOperations.setPaymentsFilters(values, false, false, false, true))
  }

  const deleteOption = {
    label: t('Pay'),
    icon: 'Pay',
    onClick: () => payItemHandler(),
  }

  return deleteOption
}
