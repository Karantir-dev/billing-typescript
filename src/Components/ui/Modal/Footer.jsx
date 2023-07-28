import s from './Modal.module.scss'
import cn from 'classnames'

export const Footer = ({ children, className, column }) => (
  <div className={cn(s.modal__footer, className, { [s.modal__footer_column]: column })}>
    {children}
  </div>
)
