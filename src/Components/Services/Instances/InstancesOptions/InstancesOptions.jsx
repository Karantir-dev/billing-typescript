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

  const { isNotActive, isStopped, isResized, isRescued, restartInProgress } =
    getInstanceMainInfo(item)

  const isHideMostItems = isResized || isRescued

  const options = [
    {
      label: t('Unrescue'),
      icon: 'Wrench',
      hidden: !isRescued,
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
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
          }),
        ),
      disabled: isNotActive || restartInProgress,
      hidden: isHideMostItems,
    },
    {
      label: t('Console'),
      icon: 'Console',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsOperations.openConsole({ elid: item.id.$ })),
    },
    {
      label: t('Reboot'),
      icon: 'Reboot',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'reboot' },
          }),
        ),
      hidden: isHideMostItems,
    },
    {
      label: t('Resize'),
      icon: 'Resize',
      disabled: isNotActive || item.change_pricelist?.$ === 'off',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
      hidden: isHideMostItems,
    },

    {
      label: t('Change password'),
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
      hidden: isHideMostItems,
    },
    {
      label: t('Rescue'),
      icon: 'Rescue',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'bootimage' },
          }),
        ),
      hidden: isHideMostItems,
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ instruction: item })),
      hidden: isHideMostItems,
    },
    {
      label: t('Rebuild'),
      icon: 'Rebuild',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'rebuild' },
          }),
        ),
      hidden: isHideMostItems,
    },
    {
      label: t('Create ticket'),
      icon: 'Headphone',
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
      hidden: isHideMostItems,
    },
    {
      label: t('Rename'),
      icon: 'Rename',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
      hidden: isHideMostItems,
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  const optionsColumns = isMobile ? 1 : options.filter(el => !el.hidden).length > 5 && 2

  return <Options options={options} columns={optionsColumns} />
}
