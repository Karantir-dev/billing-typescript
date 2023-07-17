import s from './Modal.module.scss'
import cn from 'classnames'

export const Body = ({ children, className }) => {
  return (
    <div className={s.modal__body_wrapper}>
      <div className={cn(s.modal__body, className)}>{children}</div>
    </div>
  )
}
