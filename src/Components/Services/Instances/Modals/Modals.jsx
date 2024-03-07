/* eslint-disable no-unused-vars */
import { ChangePasswordModal, DeleteModal, EditNameModal, ConfirmModal } from '.'
import { cloudVpsActions } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const Modals = ({
  deleteInstanceSubmit,
  changeInstancePasswordSubmit,
  editNameSubmit,
  confirmSubmit,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(state => state.cloudVps.itemForModals)

  return (
    <>
      {!!itemForModals?.change_pass && (
        <ChangePasswordModal
          item={itemForModals?.change_pass}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ change_pass: false }))
          }
          onSubmit={changeInstancePasswordSubmit}
        />
      )}
      {!!itemForModals?.delete && (
        <DeleteModal
          item={itemForModals?.delete}
          closeModal={() => dispatch(cloudVpsActions.setItemForModals({ delete: false }))}
          onSubmit={deleteInstanceSubmit}
        />
      )}
      {!!itemForModals?.edit_name && (
        <EditNameModal
          item={itemForModals?.edit_name}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ edit_name: false }))
          }
          onSubmit={editNameSubmit}
        />
      )}

      {!!itemForModals?.confirm && (
        <ConfirmModal
          item={itemForModals?.confirm}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ confirm: false }))
          }
          onSubmit={confirmSubmit}
        />
      )}
    </>
  )
}
