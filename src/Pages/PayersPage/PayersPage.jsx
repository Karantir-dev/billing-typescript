import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Container,
  Pagination,
  PayersTable,
  Portal,
  ModalAddPayer,
} from '../../Components'
import { payersOperations, payersSelectors } from '../../Redux'
import s from './PayersPage.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const [currentPage, setCurrentPage] = useState(1)
  const [addPayerModal, setAddPayerModal] = useState(false)

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersCount = useSelector(payersSelectors.getPayersCount)

  useEffect(() => {
    dispatch(payersOperations.getPayers())
  }, [])

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(payersOperations.getPayers(data))
  }, [currentPage])

  return (
    <Container>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('Payers')}</h1>
        <Button
          onClick={() => setAddPayerModal(!addPayerModal)}
          label={t('Add')}
          className={s.addBtn}
        />
        <PayersTable list={payersList} />
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
        {addPayerModal && <ModalAddPayer setAddPayerModal={setAddPayerModal} />}
      </Portal>
    </Container>
  )
}
