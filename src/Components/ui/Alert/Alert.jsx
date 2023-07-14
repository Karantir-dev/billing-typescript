import PropTypes from 'prop-types'
import { Modal } from '@components'

import s from './Alert.module.scss'

export default function Alert({
  isOpened,
  title,
  mainBtn,
  text,
  controlAlert,
  dataTestid,
}) {
  return (
    <Modal
      isOpen={isOpened}
      closeModal={controlAlert}
      data-testid={dataTestid}
      className={s.modal}
    >
      <Modal.Header>
        <h5 className={s.modal_title}>{title}</h5>
      </Modal.Header>
      <Modal.Body>
        <p className={s.alert_text}>{text}</p>
      </Modal.Body>
      <Modal.Footer column>{mainBtn}</Modal.Footer>
    </Modal>
  )
}

Alert.propTypes = {
  isOpened: PropTypes.bool,
  title: PropTypes.string,
  mainBtn: PropTypes.object,
  text: PropTypes.string,
  controlAlert: PropTypes.func,
  dataTestid: PropTypes.string,
}
