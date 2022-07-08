import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Pagination, PayersTable, Portal, ModalAddPayer } from '../../Components'
import { payersActions, payersOperations, payersSelectors } from '../../Redux'
import s from './PayersPage.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const [currentPage, setCurrentPage] = useState(1)
  const [addPayerModal, setAddPayerModal] = useState(false)
  const [elid, setElid] = useState(null)

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersCount = useSelector(payersSelectors.getPayersCount)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(payersOperations.getPayers(data))
  }, [currentPage])

  const closeAddModalHandler = () => {
    setElid(null)
    dispatch(payersActions.setPayersSelectedFields(null))
    setAddPayerModal(false)
  }

  const openEditModalHandler = id => {
    setElid(id)
    setAddPayerModal(true)
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('Payers')}</h1>
        <Button
          onClick={() => setAddPayerModal(!addPayerModal)}
          label={t('Add')}
          isShadow
          className={s.addBtn}
        />
        <PayersTable openEditModalHandler={openEditModalHandler} list={payersList} />
        <div className={s.content}>
          <div className={s.pagination}>
            <Pagination
              currentPage={currentPage}
              totalCount={Number(payersCount)}
              pageSize={30}
              onPageChange={page => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      <Portal>
        {addPayerModal && (
          <ModalAddPayer elid={elid} closeAddModalHandler={closeAddModalHandler} />
        )}
      </Portal>
    </>
  )
}
