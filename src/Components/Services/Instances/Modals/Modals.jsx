import {
  ChangePasswordModal,
  DeleteModal,
  EditNameModal,
  ConfirmModal,
  ResizeModal,
  RebuildModal,
} from '.'
import {
  cloudVpsActions,
  cloudVpsOperations,
  cloudVpsSelectors,
  dedicOperations,
} from '@redux'
import { InstructionModal } from '@components'
import { useDispatch, useSelector } from 'react-redux'

export const Modals = ({
  editNameSubmit,
  loadingParams = {},
  pagination,
  setPagination = () => {},
  getInstances = () => {},
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const deleteInstanceSubmit = () => {
    dispatch(
      cloudVpsOperations.deleteInstance({
        elid: itemForModals.delete.id.$,
        closeModal: () => dispatch(cloudVpsActions.setItemForModals({ delete: false })),
        ...loadingParams,
        successCallback: () => setPagination({ p_num: 1 }),
      }),
    )
  }

  const confirmSubmit = (action, elid) => {
    if (action.includes('resize_')) {
      return dispatch(
        cloudVpsOperations.changeTariffConfirm({
          action: action.replace('resize_', ''),
          elid,
          closeModal: () =>
            dispatch(cloudVpsActions.setItemForModals({ confirm: false })),
          ...loadingParams,
          ...pagination,
        }),
      )
    } else if (action === 'unrescue') {
      return dispatch(
        cloudVpsOperations.rebuildInstance({
          action: itemForModals.confirm.confirm_action,
          elid: itemForModals.confirm.id.$,
          successCallback: () => {
            dispatch(cloudVpsActions.setItemForModals({ confirm: false }))
            getInstances()
          },
        }),
      )
    } else {
      return dispatch(
        cloudVpsOperations.changeInstanceState({
          action,
          elid,
          closeModal: () =>
            dispatch(cloudVpsActions.setItemForModals({ confirm: false })),
          ...loadingParams,
          ...pagination,
        }),
      )
    }
  }

  const resizeSubmit = values => {
    dispatch(
      cloudVpsOperations.changeTariff({
        elid: itemForModals.resize.id.$,
        pricelist: values.pricelist,
        successCallback: () =>
          dispatch(cloudVpsActions.setItemForModals({ resize: false })),
        ...loadingParams,
        ...pagination,
      }),
    )
  }

  const rebuildSubmit = values => {
    dispatch(cloudVpsActions.setItemForModals({ rebuild: false }))

    dispatch(
      cloudVpsOperations.rebuildInstance({
        action: itemForModals.rebuild.rebuild_action,
        elid: itemForModals.rebuild.id.$,
        sok: 'ok',
        clicked_button: 'ok',
        ...values,
        successCallback: () => getInstances(),
      }),
    )
  }

  const changeInstancePasswordSubmit = password => {
    dispatch(
      cloudVpsOperations.changeInstancePassword({
        password,
        elid: itemForModals.change_pass.id.$,
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ change_pass: false })),
        ...loadingParams,
      }),
    )
  }

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
    </>
  )
}
