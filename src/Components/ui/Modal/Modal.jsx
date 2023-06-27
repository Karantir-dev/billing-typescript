import { Portal, Backdrop } from '@components'
import PropTypes from 'prop-types'
import s from './Modal.module.scss'
import { ModalProvider } from './ModalContext'
import { Header } from './Header'
import { Body } from './Body'
import { Footer } from './Footer'
import cn from 'classnames'
import { useEffect, useRef } from 'react'

const ModalWrapper = ({
  children,
  closeModal,
  isOpen,
  className,
  bgClassname,
  simple,
  noScroll,
  ...props
}) => {
  const modal = useRef()

  useEffect(() => {
    if (!isOpen) return
    const elements = modal.current.querySelectorAll('button, a, input, select')
    const firstEl = elements[0]
    
    if (firstEl) {
      firstEl.focus()
    }

    const keyDownHabdler = e => {
      const lastEl = Array.from(elements).findLast(el => !el.disabled)

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }

      if (e.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', keyDownHabdler)

    return () => window.removeEventListener('keydown', keyDownHabdler)
  }, [isOpen])

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
                ref={modal}
                {...props}
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
