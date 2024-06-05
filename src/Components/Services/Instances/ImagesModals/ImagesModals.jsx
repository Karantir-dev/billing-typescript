/* eslint-disable no-unused-vars */
import { CreateSnapshotOrBackupModal } from './'

import {
  cloudVpsActions,
  // cloudVpsOperations,
  cloudVpsSelectors,
} from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const ImagesModals = ({
  loadingParams = {},
  pagination = {},
  setPagination = () => {},
  setSnapshot,
  setBackup,
  redirectCallback,
}) => {
  const dispatch = useDispatch()
  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

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
          onSubmit={itemForModals?.snapshot_create ? setSnapshot : setBackup}
        />
      )}
    </>
  )
}
