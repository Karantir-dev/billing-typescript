import { Icon } from '@components'
import s from './WarningMessage.module.scss'

export default function WarningMessage({ children }) {
  return (
    <div className={s.warning}>
      <Icon name="Attention" />
      <p>{children}</p>
    </div>
  )
}
