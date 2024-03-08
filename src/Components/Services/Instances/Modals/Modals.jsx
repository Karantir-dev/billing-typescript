/* eslint-disable no-unused-vars */
import {
  ChangePasswordModal,
  DeleteModal,
  EditNameModal,
  ConfirmModal,
  ResizeModal,
  RebuildModal,
} from '.'

export const Modals = ({
  itemForModals,
  setItemForModals,
  deleteInstanceSubmit,
  changeInstancePasswordSubmit,
  editNameSubmit,
  confirmSubmit,
  resizeSubmit,
}) => (
  <>
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

    {!!itemForModals.confirm && (
      <ConfirmModal
        item={itemForModals.confirm}
        closeModal={() => setItemForModals({ confirm: false })}
        onSubmit={confirmSubmit}
      />
    )}
    {!!itemForModals.resize && (
      <ResizeModal
        item={itemForModals.resize}
        closeModal={() => setItemForModals({ resize: false })}
        onSubmit={resizeSubmit}
      />
    )}
    {!!itemForModals.rebuild && (
      <RebuildModal
        item={itemForModals.rebuild}
        closeModal={() => setItemForModals({ rebuild: false })}
        onSubmit={() => {}}
      />
    )}
  </>
)
