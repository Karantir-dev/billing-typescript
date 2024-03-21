import { useEffect, useReducer, useState } from 'react'
import { SshList, Button, Loader, Pagination } from '@components'
import s from './SSHKeysPage.module.scss'

import { AddSshKeyModal } from '@components/Services/Instances/Modals'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { useCancelRequest } from '@src/utils'
import { Modals } from '@components/Services/Instances/Modals/Modals'
import { useTranslation } from 'react-i18next'

export default function SSHKeysPage() {
  const { t } = useTranslation(['cloud_vps'])

  const [isAddModalOpened, setIsAddModalOpened] = useState(false)
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [sortBy, setSortBy] = useState('+id')

  const sshItems = useSelector(cloudVpsSelectors.getSshList)

  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const setNewSshKey = values => {
    dispatch(
      cloudVpsOperations.setSshKey({
        ...values,
        setIsAddModalOpened,
        ...getSshRequiredParams,
      }),
      setPagination({ p_num: 1 }),
    )
  }

  const [pagination, setPagination] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { p_num: 1, p_cnt: '10', totalElems: 0 },
  )

  /* crutch for paginations */
  const [isPaginationChanged, setIsPaginationChanged] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const getSshRequiredParams = {
    setTotalElems: value => setPagination({ totalElems: value }),
    signal,
    setIsLoading,
  }

  useEffect(() => {
    getSsh()
    setIsFirstRender(false)
  }, [])

  const getSsh = ({ p_col, p_num, p_cnt, isLoader } = {}) => {
    dispatch(
      cloudVpsOperations.getSshKeys({
        p_col,
        p_cnt: p_cnt ?? pagination.p_cnt,
        p_num: p_num ?? pagination.p_num,
        ...getSshRequiredParams,
        isLoader,
      }),
    )
  }

  useEffect(() => {
    if (!isFirstRender) {
      getSsh()
    }
  }, [isPaginationChanged])

  const setSortValue = value => {
    setSortBy(value)
    getSsh(value)
  }

  const editSshHandler = ({ values, elid, closeModal, errorCallback }) => {
    dispatch(
      cloudVpsOperations.editSsh({
        values,
        elid,
        errorCallback,
        closeModal,
        ...getSshRequiredParams,
      }),
    )
  }

  const editNameSubmit = ({ value, elid, closeModal, errorCallback }) => {
    editSshHandler({
      values: { comment: value },
      elid,
      closeModal,
      errorCallback,
    })
  }

  const deleteSshSubmit = () => {
    setPagination({ p_num: 1 })
    dispatch(
      cloudVpsOperations.deleteSsh({
        elid: itemForModals?.ssh_delete.elid.$,
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ ssh_delete: false })),
        ...getSshRequiredParams,
      }),
    )
  }

  return (
    <>
      {sshItems && (
        <div className={s.sshPage_wrapper}>
          <Button
            label={t('Add new SSH Key')}
            size="large"
            className={s.ssh_purchase_btn}
            isShadow
            onClick={() => {
              setIsAddModalOpened(true)
              dispatch(cloudVpsActions.setItemForModals({ publicKey: '' }))
            }}
          />
          {isAddModalOpened && (
            <AddSshKeyModal
              isAddModalOpened
              closeModal={() => {
                setIsAddModalOpened(false)
              }}
              onSubmit={setNewSshKey}
            />
          )}
          <SshList
            ssh={sshItems}
            setSortHandler={setSortValue}
            sortBy={sortBy}
            editSsh={editNameSubmit}
          />
        </div>
      )}

      {pagination.totalElems > 5 && (
        <Pagination
          className={s.pagination}
          currentPage={pagination.p_num}
          totalCount={Number(pagination.totalElems)}
          onPageChange={value => {
            setPagination({ p_num: value })
            setIsPaginationChanged(prev => !prev)
          }}
          pageSize={pagination.p_cnt}
          onPageItemChange={value => {
            setPagination({ p_cnt: value })
          }}
        />
      )}
      <Modals deleteSshSubmit={deleteSshSubmit} renameSshSubmit={editNameSubmit} />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
