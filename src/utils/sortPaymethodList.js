import { PAYMETHODS_ORDER } from '@utils/constants'

export default function sortPaymethodList(list) {
  return [...list].sort((a, b) => {
    if (a.paymethod_type?.$ === '0') return -1
    if (b.paymethod_type?.$ === '0') return 1

    const indexA = PAYMETHODS_ORDER.indexOf(a.paymethod?.$)
    const indexB = PAYMETHODS_ORDER.indexOf(b.paymethod?.$)

    if (indexA === -1) return 1
    if (indexB === -1) return -1

    return indexA - indexB
  })
}
