/* eslint-disable no-unused-vars */
import { ChangePasswordModal, ShutDownModal, DeleteModal, EditNameModal } from '.'

export const Modals = ({
  itemForModals,
  setItemForModals,
  deleteInstanceSubmit,
  startStopInstanceSubmit,
  changeInstancePasswordSubmit,
  editNameSubmit,
}) => (
  <>
    {!!itemForModals.start_stop && (
      <ShutDownModal
        item={itemForModals.start_stop}
        closeModal={() => setItemForModals({ start_stop: false })}
        onSubmit={startStopInstanceSubmit}
      />
    )}
    {!!itemForModals.change_pass && (
      <ChangePasswordModal
        item={itemForModals.change_pass}
        closeModal={() => setItemForModals({ change_pass: false })}
        onSubmit={changeInstancePasswordSubmit}
      />
    )}
    {!!itemForModals.delete && (
      <DeleteModal
        item={itemForModals.delete}
        closeModal={() => setItemForModals({ delete: false })}
        onSubmit={deleteInstanceSubmit}
      />
    )}
    {!!itemForModals.edit_name && (
      <EditNameModal
        item={itemForModals.edit_name}
        closeModal={() => setItemForModals({ edit_name: false })}
        onSubmit={editNameSubmit}
      />
    )}
  </>
)
