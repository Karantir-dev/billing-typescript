import { Options } from '@components'
import { cloudVpsActions, cloudVpsOperations } from '@src/Redux'
import { useCreateTicketOption, getInstanceMainInfo } from '@src/utils'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import s from './InstancesOptions..module.scss'

export default function InstancesOptions({
  item,
  isMobile,
  buttonClassName,
  isTileLayout,
}) {
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()

  const widerThan1024 = useMediaQuery({ query: '(min-width: 1024px)' })

  const {
    isDisabled,
    isProcessing,
    isStopped,
    isResized,
    isRescued,
    isWindows,
    isDeleting,
    isBootedFromISO,
    isImageUploading,
    isErrorStatus,
  } = getInstanceMainInfo(item)
  const isHideMostItems = isResized || isRescued || isBootedFromISO

  const createTicketOption = useCreateTicketOption(item.id.$)

  const options = [
    {
      label: t('Unrescue'),
      icon: 'Wrench',
      hidden: !isRescued,
      disabled: isDisabled,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'unrescue' },
          }),
        ),
    },
    {
      label: t('unmount_iso'),
      icon: 'Wrench',
      hidden: !isBootedFromISO,
      disabled: isDisabled,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'unmount' },
          }),
        ),
    },
    {
      label: t('Confirm Resize'),
      icon: 'Check_square',
      hidden: !isResized,
      disabled: isDisabled,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'resize_confirm' },
          }),
        ),
    },
    {
      label: t('Revert Resize'),
      icon: 'Close_square',
      hidden: !isResized,
      disabled: isDisabled,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'resize_rollback' },
          }),
        ),
    },

    {
      label: t(isStopped ? 'Start' : 'Shut down'),
      icon: 'Shutdown',
      disabled: isDisabled,
      hidden: isHideMostItems,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
          }),
        ),
    },
    {
      label: t('Console'),
      icon: 'Console',
      disabled: isDisabled || isStopped,
      onClick: () => dispatch(cloudVpsOperations.openConsole({ elid: item.id.$ })),
    },
    {
      label: t('Reboot'),
      icon: 'Reboot',
      disabled: isDisabled || isStopped,
      hidden: isHideMostItems,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'reboot' },
          }),
        ),
    },
    {
      label: t('Resize'),
      icon: 'Resize',
      disabled: isDisabled || item.change_pricelist?.$ === 'off',
      hidden: isHideMostItems,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
    },
    {
      label: t('Change password'),
      icon: 'ChangePassword',
      disabled: isDisabled || isStopped,
      hidden: isHideMostItems || isWindows,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
    },
    {
      label: t('Rescue'),
      icon: 'Rescue',
      disabled: isDisabled,
      hidden: isHideMostItems,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'rescue' },
          }),
        ),
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isDeleting || isImageUploading || isErrorStatus,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ instruction: item })),
    },
    {
      label: t('Rebuild'),
      icon: 'Rebuild',
      disabled: isDisabled,
      hidden: isHideMostItems,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'rebuild' },
          }),
        ),
    },
    createTicketOption,
    {
      label: t('Rename'),
      icon: 'Rename',
      disabled: isDeleting,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: t('boot_from_iso'),
      icon: 'Iso',
      disabled: isProcessing || isDeleting || isImageUploading || isDisabled,
      hidden: isHideMostItems,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'boot_from_iso' },
          }),
        ),
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      disabled: isProcessing || isDeleting || isErrorStatus,
      isDelete: true,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
    },
  ]

  const optionsColumns = isMobile ? 1 : options.filter(el => !el.hidden).length > 5 && 2

  return (
    <Options
      options={options}
      columns={optionsColumns}
      buttonClassName={[s.btn, buttonClassName]}
      isTileLayout={isTileLayout && widerThan1024}
    />
  )
}
