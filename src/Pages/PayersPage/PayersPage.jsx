import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Pagination, PayersTable, ModalAddPayer, Loader } from '@components'
import { payersActions, payersOperations, payersSelectors } from '@redux'
import s from './PayersPage.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component() {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [addPayerModal, setAddPayerModal] = useState(false)
  const [elid, setElid] = useState(null)

  const payersList = useSelector(payersSelectors.getPayersList)
  const payersCount = useSelector(payersSelectors.getPayersCount)
  const isLoading = useSelector(payersSelectors.getIsLoadingPayers)
  const signal = useCancelRequest()

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(payersOperations.getPayers(data, 'payers', signal))
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

  if (!payersList) return null

  return (
    <>
      <div className={s.body}>
        <div className={s.content}>
          <h1 className={s.pageTitle}>{t('Payers')}</h1>
          {payersList?.length !== 0 ? (
            <PayersTable openEditModalHandler={openEditModalHandler} list={payersList} />
          ) : (
            <>
              <Button
                onClick={() => setAddPayerModal(!addPayerModal)}
                label={t('Add')}
                isShadow
                className={s.addBtn}
              />
              <div className={s.noResults}>{t('nothing_found', { ns: 'other' })}</div>
            </>
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
      {addPayerModal && (
        <ModalAddPayer elid={elid} closeAddModalHandler={closeAddModalHandler} />
      )}
      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
