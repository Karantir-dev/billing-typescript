import {
  CreateSnapshotOrBackupModal,
  CopyModal,
  CreateEditImageModal,
  DeleteModal,
  RestoreModal,
  CreateEditBackupsSchedules,
} from './'

import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'
import { IMAGES_TYPES } from '@src/utils/constants'
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
        successCallback: () => {
          getItems()
          fetchInstanceData()
        },
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
        successCallback: () => {
          getItems()
          fetchInstanceData()
        },
      }),
    )
  }

  const createScheduleBackup = values => {
    dispatch(
      cloudVpsActions.setItemForModals({
        backup_schedule_create: false,
      }),
    )
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps.schedule',
        ...values,
        successCallback: () => {
          getItems()
          fetchInstanceData()
        },
      }),
    )
  }

  const editScheduleBackup = values => {
    dispatch(
      cloudVpsActions.setItemForModals({
        backup_schedule_edit: false,
      }),
    )
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps.schedule',
        ...values,
        successCallback: () => {
          getItems()
          fetchInstanceData()
        },
      }),
    )
  }

  const createImageSubmit = ({ name, ...values }) => {
    dispatch(
      cloudVpsOperations.createImage({
        values: { image_name: name, ...values },
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
        func: 'image',
        elid: itemForModals?.image_delete[itemForModals?.image_delete.idKey].$,
        successCallback: redirectCallback ?? getItems,
        ...loadingParams,
      }),
    )
  }
  const deleteSchedule = () => {
    dispatch(cloudVpsActions.setItemForModals({ schedule_delete: false }))
    dispatch(
      cloudVpsOperations.deleteImage({
        func: 'instances.fleio_bckps.schedule',
        elid: itemForModals?.schedule_delete.id.$,
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
        zone: IMAGES_TYPES.own,
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

      {['backup_schedule_create', 'backup_schedule_edit'].some(
        key => !!itemForModals?.[key],
      ) && (
        <CreateEditBackupsSchedules
          item={itemForModals}
          closeModal={() =>
            dispatch(
              cloudVpsActions.setItemForModals({
                backup_schedule_create: false,
                backup_schedule_edit: false,
              }),
            )
          }
          onSubmit={
            itemForModals?.backup_schedule_create
              ? createScheduleBackup
              : editScheduleBackup
          }
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
      {!!itemForModals?.schedule_delete && (
        <DeleteModal
          item={itemForModals?.schedule_delete}
          closeModal={() =>
            dispatch(cloudVpsActions.setItemForModals({ schedule_delete: false }))
          }
          onSubmit={deleteSchedule}
          type="schedule"
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
