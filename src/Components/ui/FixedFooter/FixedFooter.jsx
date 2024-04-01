import cn from 'classnames'
import s from './FixedFooter.module.scss'

export default function FixedFooter({ children, isShown }) {
  return <div className={cn(s.buying_panel, { [s.opened]: isShown })}>{children}</div>
}
