import s from './BlockPageMessage.module.scss'
import cn from 'classnames'

export default function BlockPageMessage({ text, className }) {
  return (
    <div className={cn(s.wrapper, className)}>
      <div className={s.block}>{text}</div>
    </div>
  )
}
