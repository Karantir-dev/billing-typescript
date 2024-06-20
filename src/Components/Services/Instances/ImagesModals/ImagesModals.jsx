import {
  CreateSnapshotOrBackupModal,
  CopyModal,
  CreateEditImageModal,
  DeleteModal,
  RestoreModal,
} from './'

import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export const ImagesModals = ({
  loadingParams = {},
  redirectCallback,
  getItems,
  editImage,
  dailyCosts,
  fetchInstanceData,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)
  const { id: instanceId } = useParams()

  const createSnapshot = values => {
    dispatch(
      cloudVpsActions.setItemForModals({
        snapshot_create: false,
      }),
    )
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.snapshots',
        ...values,
        successCallback: getItems,
      }),
    )
  }

  const createBackup = values => {
    dispatch(
      cloudVpsActions.setItemForModals({
        backup_create: false,
      }),
    )
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps',
        ...values,
        successCallback: getItems,
      }),
    )
  }

  const createImageSubmit = values => {
    dispatch(
      cloudVpsOperations.createImage({
        values,
        successCallback: () => getItems(),
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ images_edit: false })),
      }),
    )
  }

  const deleteImage = () => {
    dispatch(cloudVpsActions.setItemForModals({ image_delete: false }))
    dispatch(
      cloudVpsOperations.deleteImage({
        elid: itemForModals?.image_delete[itemForModals?.image_delete.idKey].$,
        successCallback: redirectCallback ?? getItems,
        ...loadingParams,
      }),
    )
  }

  const createImageCopy = values => {
    dispatch(cloudVpsActions.setItemForModals({ images_copy: false }))
    dispatch(
      cloudVpsOperations.copyModal({
        elid: itemForModals?.images_copy?.id?.$,
        ...values,
        successCallback: redirectCallback ?? getItems,
        ...loadingParams,
      }),
    )
  }

  const restoreSubmit = values => {
    dispatch(cloudVpsActions.setItemForModals({ restore_modal: false }))

    dispatch(
      cloudVpsOperations.rebuildInstance({
        action: 'rebuild',
        elid: instanceId,
        sok: 'ok',
        clicked_button: 'ok',
        successCallback: fetchInstanceData,
        ...values,
      }),
    )
  }

  return (
    <>
      {['snapshot_create', 'backup_create'].some(key => !!itemForModals?.[key]) && (
        <CreateSnapshotOrBackupModal
          item={itemForModals}
          closeModal={() =>
            dispatch(
              cloudVpsActions.setItemForModals({
                snapshot_create: false,
                backup_create: false,
              }),
            )
          }
          onSubmit={itemForModals?.snapshot_create ? createSnapshot : createBackup}
        />
      )}

      {!!itemForModals?.images_copy && (
        <CopyModal
          item={itemForModals?.images_copy}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ images_copy: false }))
          }
          onSubmit={createImageCopy}
        />
      )}
      {!!itemForModals?.images_edit && (
        <CreateEditImageModal
          item={itemForModals?.images_edit}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ images_edit: false }))
          }
          onSubmit={
            itemForModals?.images_edit === 'create' ? createImageSubmit : editImage
          }
          cost={dailyCosts}
        />
      )}
      {!!itemForModals?.image_delete && (
        <DeleteModal
          item={itemForModals?.image_delete}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ image_delete: false }))
          }
          onSubmit={deleteImage}
        />
      )}
      {!!itemForModals?.restore_modal && (
        <RestoreModal
          item={itemForModals?.restore_modal}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ restore_modal: false }))
          }
          onSubmit={restoreSubmit}
          instanceId={instanceId}
        />
      )}
    </>
  )
}
