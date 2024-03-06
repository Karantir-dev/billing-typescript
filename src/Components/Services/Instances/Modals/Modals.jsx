import { ChangePasswordModal, ShutDownModal, DeleteModal } from '.'

export const Modals = ({
  stopInstanceModal,
  setStopInstanceModal,
  changePasswordModal,
  setChangePasswordModal,
  deleteModal,
  setDeleteModal,
}) => (
  <>
    {!!stopInstanceModal && (
      <ShutDownModal
        stopInstanceModal={stopInstanceModal}
        setStopInstanceModal={setStopInstanceModal}
      />
    )}
    {!!changePasswordModal && (
      <ChangePasswordModal
        changePasswordModal={changePasswordModal}
        setChangePasswordModal={setChangePasswordModal}
      />
    )}
    {!!deleteModal && (
      <DeleteModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
    )}
  </>
)
