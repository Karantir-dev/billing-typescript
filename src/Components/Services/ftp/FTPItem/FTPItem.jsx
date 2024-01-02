import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './FTPItem.module.scss'
import { CheckBox, ServerState, Options } from '@components'
import { useDispatch } from 'react-redux'
import { dedicOperations } from '@redux'
import { isUnpaidOrder } from '@utils'

export default function FTPItem({
  storage,
  rights,
  activeServices,
  setActiveServices,
  setElidForProlongModal,
  setElidForEditModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setIdForDeleteModal,
  unpaidItems,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const dispatch = useDispatch()

  const isToolsBtnVisible =
    Object.keys(rights)?.filter(key => key !== 'ask' && key !== 'filter' && key !== 'new')
      .length > 0

  const isActive = activeServices?.some(service => service?.id?.$ === storage?.id?.$)
  const toggleIsActiveHandler = () => {
    isActive
      ? setActiveServices(activeServices?.filter(item => item?.id?.$ !== storage?.id?.$))
      : setActiveServices([...activeServices, storage])
  }

  const handleToolBtnClick = fn => {
    fn()
  }

  const deleteOption = isUnpaidOrder(storage, unpaidItems)

  const options = [
    deleteOption,
    {
      label: t('instruction'),
      icon: 'Info',
      disabled: storage?.status?.$ === '1' || !rights?.instruction,
      onClick: () => handleToolBtnClick(setElidForInstructionModal),
    },
    {
      label: t('go_to_panel'),
      icon: 'ExitSign',
      disabled:
        storage.transition?.$ !== 'on' ||
        !rights?.gotoserver ||
        storage?.status?.$ !== '2',
      onClick: () => dispatch(dedicOperations.goToPanel(storage.id.$)),
    },
    {
      label: t('prolong'),
      icon: 'Clock',
      disabled: storage?.status?.$ === '1' || !rights?.prolong,
      onClick: () => handleToolBtnClick(setElidForProlongModal),
    },
    {
      label: t('edit', { ns: 'other' }),
      icon: 'Edit',
      disabled: !rights?.edit || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForEditModal),
    },
    {
      label: t('history'),
      icon: 'Refund',
      disabled: !rights?.history || storage?.status?.$ === '1',
      onClick: () => handleToolBtnClick(setElidForHistoryModal),
    },
    {
      label: t('delete', { ns: 'other' }),
      icon: 'Delete',
      disabled:
        storage?.status?.$ === '5' ||
        storage?.scheduledclose?.$ === 'on' ||
        !rights?.delete,
      onClick: () => setIdForDeleteModal([storage.id.$]),
      isDelete: true,
    },
  ]

  return (
    <div className={s.item_wrapper}>
      <CheckBox
        className={s.check_box}
        value={isActive}
        onClick={toggleIsActiveHandler}
      />

      <div
        className={cn(s.item, {
          [s.active_server]: isActive,
        })}
      >
        <span className={s.value}>{storage?.id?.$}</span>
        <span className={s.value}>{storage?.pricelist?.$}</span>
        <span className={s.value}>{storage?.datacentername?.$}</span>
        <span className={s.value}>{storage?.createdate?.$}</span>
        <span className={s.value}>{storage?.expiredate?.$}</span>
        <ServerState className={s.value} server={storage} />

        <span className={s.value}>
          {storage?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>

        {isToolsBtnVisible && <Options options={options} />}
      </div>
    </div>
  )
}

FTPItem.propTypes = {
  storage: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  rights: PropTypes.object,
}
