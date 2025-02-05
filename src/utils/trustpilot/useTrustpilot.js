import { userSelectors } from '@src/Redux'
import { useSelector } from 'react-redux'

export default function useTrustpilot() {
  const { $email, $realname } = useSelector(userSelectors.getUserInfo)

  const sendEmail = id => {
    const trustpilot_invitation = {
      recipientEmail: $email,
      recipientName: $realname,
      referenceId: id,
      source: 'InvitationScript',
    }

    if (window.tp) window.tp('createInvitation', trustpilot_invitation)
  }

  return { sendEmail }
}
