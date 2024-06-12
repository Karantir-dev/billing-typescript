/* eslint-disable no-unused-vars */
import { CreateSnapshotOrBackupModal, CopyModal, CreateEditImageModal } from './'

import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const ImagesModals = ({
  loadingParams = {},
  pagination = {},
  setPagination = () => {},
  setBackup,
  redirectCallback,
  getItems,
  editImage,
  cost,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const editSnapshot = values => {
    dispatch(cloudVpsActions.setItemForModals({ snapshot_edit: false }))

    cloudVpsOperations.editSnapshot({
      plid: itemForModals?.snapshot_edit.id.$,
      // elid: itemForModals?.snapshot_edit. ????? here should be id of snapshot later to change it
      ...values,
    })
  }

  const createSnapshot = values => {
    dispatch(cloudVpsActions.setItemForModals({ snapshot_create: false }))

    dispatch(
      cloudVpsOperations.editSnapshot({
        plid: itemForModals?.snapshot_create.id.$,
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

  return (
    <>
      {['snapshot_create', 'backup_create'].some(key => !!itemForModals?.[key]) && (
        <CreateSnapshotOrBackupModal
          item={itemForModals?.snapshot_create || itemForModals?.backup_create}
          closeModal={() =>
            dispatch(
              cloudVpsActions.setItemForModals({
                snapshot_create: false,
                backup_create: false,
              }),
            )
          }
          onSubmit={itemForModals?.snapshot_create ? createSnapshot : setBackup}
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
          cost={cost}
        />
      )}
    </>
  )
}
