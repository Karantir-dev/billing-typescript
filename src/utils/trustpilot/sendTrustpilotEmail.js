export default function sendTrustpilotEmail($email, $realname, cartData) {
  const serviceItem = cartData?.elemList?.[0]

  const isDedic = serviceItem?.['item.type']?.$ === 'dedic'
  const isNotRenewal = !serviceItem?.desc?.$?.includes('renewal')
  const isInnerBalancePaymethod = cartData?.paymethod_name.includes('Account balance')

  if (isDedic && isNotRenewal && isInnerBalancePaymethod) {
    const trustpilot_invitation = {
      recipientEmail: $email,
      recipientName: $realname,
      referenceId: cartData?.billorder,
      source: 'InvitationScript',
    }

    if (window.tp) window.tp('createInvitation', trustpilot_invitation)
  }
}
