import { Icon } from '@components'
import { useModalContext } from './ModalContext'
import s from './Modal.module.scss'
import cn from 'classnames'

export const Header = ({ children, className, closeClassName }) => {
  const { closeModal } = useModalContext()

  return (
    <div className={cn(s.modal__header, className)}>
      <div className={s.modal__header_content}>{children}</div>
      <button onClick={closeModal} className={cn(s.modal__close, closeClassName)}>
        <Icon name="Cross" />
      </button>
    </div>
  )
}
