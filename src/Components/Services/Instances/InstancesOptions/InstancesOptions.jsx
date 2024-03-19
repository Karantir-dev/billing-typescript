import { Options } from '@components'
import { cloudVpsActions, cloudVpsOperations } from '@src/Redux'
import * as route from '@src/routes'
import { getInstanceMainInfo } from '@src/utils'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function InstancesOptions({ item, isMobile }) {
  const { t } = useTranslation(['cloud_vps'])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isDisabled, isProcessing, isStopped, isResized, isRescued } =
    getInstanceMainInfo(item)

  const isHideMostItems = isResized || isRescued

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
      hidden: isHideMostItems,
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
            rebuild: { ...item, rebuild_action: 'bootimage' },
          }),
        ),
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isDisabled,
      hidden: isHideMostItems,
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
    {
      label: t('Create ticket'),
      icon: 'Headphone',
      hidden: isHideMostItems,
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
    },
    {
      label: t('Rename'),
      icon: 'Rename',
      disabled: isDisabled,
      hidden: isHideMostItems,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      disabled: isProcessing,
      isDelete: true,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
    },
  ]

  const optionsColumns = isMobile ? 1 : options.filter(el => !el.hidden).length > 5 && 2

  return <Options options={options} columns={optionsColumns} />
}
