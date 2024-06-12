/* eslint-disable no-unused-vars */
import { CreateSnapshotOrBackupModal, CopyModal } from './'

import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const ImagesModals = ({
  loadingParams = {},
  pagination = {},
  setPagination = () => {},
  redirectCallback,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const createSnapshot = values => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.snapshots',
        ...values,
      }),
    )
  }

  const createBackup = values => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps',
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
          onSubmit={() => {}}
        />
      )}
    </>
  )
}
