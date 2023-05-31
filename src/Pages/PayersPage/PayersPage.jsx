import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Pagination, PayersTable, Portal, ModalAddPayer } from '../../Components'
import { payersActions, payersOperations, payersSelectors } from '../../Redux'
import s from './PayersPage.module.scss'

export default function Component() {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [addPayerModal, setAddPayerModal] = useState(false)
  const [elid, setElid] = useState(null)

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersCount = useSelector(payersSelectors.getPayersCount)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(payersOperations.getPayers(data))
  }, [p_num, p_cnt])

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
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('Payers')}</h1>
          <Button
            onClick={() => setAddPayerModal(!addPayerModal)}
            label={t('Add')}
            isShadow
            className={s.addBtn}
          />
          {payersList?.length !== 0 ? (
            <PayersTable openEditModalHandler={openEditModalHandler} list={payersList} />
          ) : (
            <div className={s.noResults}>{t('nothing_found', { ns: 'other' })}</div>
          )}
          {payersCount > 5 && (
            <div className={s.pagination}>
              <Pagination
                totalCount={Number(payersCount)}
                currentPage={p_num}
                pageSize={p_cnt}
                onPageChange={page => setP_num(page)}
                onPageItemChange={items => setP_cnt(items)}
              />
            </div>
          )}
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
