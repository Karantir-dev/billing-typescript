/* eslint-disable no-unused-vars */
import {
  ChangePasswordModal,
  DeleteModal,
  EditNameModal,
  ConfirmModal,
  ResizeModal,
  RebuildModal,
  // AddSshKeyModal,
} from '.'
import { cloudVpsActions, cloudVpsSelectors, dedicOperations } from '@redux'
import { InstructionModal } from '@components'
import { useDispatch, useSelector } from 'react-redux'

export const Modals = ({
  deleteInstanceSubmit,
  changeInstancePasswordSubmit,
  editNameSubmit,
  confirmSubmit,
  resizeSubmit,
  rebuildSubmit,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

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

      {!!itemForModals.resize && (
        <ResizeModal
          item={itemForModals.resize}
          closeModal={() => dispatch(cloudVpsActions.setItemForModals({ resize: false }))}
          onSubmit={resizeSubmit}
        />
      )}
      {!!itemForModals.rebuild && (
        <RebuildModal
          item={itemForModals.rebuild}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ rebuild: false }))
          }
          onSubmit={rebuildSubmit}
        />
      )}
      {!!itemForModals.instruction && (
        <InstructionModal
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ instruction: false }))
          }
          isOpen
          dispatchInstruction={setInstruction =>
            dispatch(
              dedicOperations.getServiceInstruction(
                itemForModals.instruction.id.$,
                setInstruction,
              ),
            )
          }
        />
      )}
      {/* {!!itemForModals.publicKey && (
        <AddSshKeyModal
          item={itemForModals.publicKey}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ publicKey: false }))
          }
          onSubmit={addSsh}
        />
      )} */}
    </>
  )
}
