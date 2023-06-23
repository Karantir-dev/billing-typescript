import { Portal, Backdrop } from '@components'
import PropTypes from 'prop-types'
import s from './Modal.module.scss'
import { ModalProvider } from './ModalContext'
import { Header } from './Header'
import { Body } from './Body'
import { Footer } from './Footer'
import cn from 'classnames'
import { useEffect } from 'react'

const ModalWrapper = ({
  children,
  closeModal,
  isOpen,
  className,
  bgClassname,
  simple,
  noScroll,
}) => {
  useEffect(() => {
    const closeOnEscHandler = e => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', closeOnEscHandler)

    return () => {
      window.removeEventListener('keydown', closeOnEscHandler)
    }
  })

  return (
    <>
      {isOpen && (
        <Portal>
          <ModalProvider value={{ closeModal }}>
            <Backdrop isOpened={isOpen} onClick={closeModal} className={bgClassname}>
              <div
                className={cn(s.modal, className, {
                  [s.simple]: simple,
                  [s.noScroll]: noScroll,
                })}
              >
                {children}
              </div>
            </Backdrop>
          </ModalProvider>
        </Portal>
      )}
    </>
  )
}

const Modal = props => <ModalWrapper {...props} />

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
    .isRequired,
  closeModal: PropTypes.func,
  className: PropTypes.string,
  bgClassname: PropTypes.string,
}

export default Modal
