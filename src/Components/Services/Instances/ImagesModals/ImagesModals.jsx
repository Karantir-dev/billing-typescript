/* eslint-disable no-unused-vars */
import { CreateSnapshotOrBackupModal, CopyModal, CreateEditImageModal } from './'

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
      cloudVpsOperations.editImage({
        func: 'instances.snapshots',
        ...values,
        successCallback: () => getItems(),
      }),
      dispatch(
        cloudVpsActions.setItemForModals({
          snapshot_create: false,
        }),
      ),
    )
  }

  const createBackup = values => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps',
        ...values,
      }),
      dispatch(
        cloudVpsActions.setItemForModals({
          backup_create: false,
        }),
      ),
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
          onSubmit={() => {}}
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
    </>
  )
}
