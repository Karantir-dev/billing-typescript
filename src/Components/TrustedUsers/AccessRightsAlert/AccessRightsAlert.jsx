import PropTypes from 'prop-types'

import s from './AccessRightsAlert.module.scss'
import { Button, Modal } from '@components'
import { useDispatch } from 'react-redux'
import { usersActions } from '@redux'

export default function AccessRightsAlert({ isOpen, title, list1, closeModal }) {
  const dispatch = useDispatch()

  const closeAlert = () => {
    closeModal()
    dispatch(usersActions.setRights([]))
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeAlert}
        data-testid="trusted_users_rights_alert"
      >
        <Modal.Header>
          <h5 className={s.title}>{title}</h5>
        </Modal.Header>
        <Modal.Body>
          <div data-testid="trusted_users_rights_list">{list1}</div>
        </Modal.Body>
        <Modal.Footer column>
          <Button onClick={closeModal} label="OK" className={s.submit__btn} isShadow />
        </Modal.Footer>
      </Modal>
    </>
  )
}

AccessRightsAlert.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  list1: PropTypes.object,
  list2: PropTypes.object,
  closeModal: PropTypes.func,
  dataTestid: PropTypes.string,
}
