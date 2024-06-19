/* eslint-disable no-unused-vars */
import {
  CreateSnapshotOrBackupModal,
  CopyModal,
  CreateEditImageModal,
  DeleteModal,
} from './'

import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const ImagesModals = ({
  loadingParams = {},
  pagination = {},
  setPagination = () => {},
  redirectCallback,
  getItems,
  editImage,
  dailyCosts,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

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
      }),
    )
  }

  const createImageSubmit = values => {
    dispatch(
      cloudVpsOperations.createImage({
        values,
        successCallback: () => getItems(),
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ image_edit: false })),
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
      {!!itemForModals?.image_edit && (
        <CreateEditImageModal
          item={itemForModals?.image_edit}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ image_edit: false }))
          }
          onSubmit={
            itemForModals?.image_edit === 'create' ? createImageSubmit : editImage
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
    </>
  )
}
