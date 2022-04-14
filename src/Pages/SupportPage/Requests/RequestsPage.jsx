import React, { useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SupportFilter, SupportTable } from '../../../Components/'
import supportSelectors from '../../../Redux/support/supportSelectors'
import supportOperations from '../../../Redux/support/supportOperations'
// import s from './RequestsPage.module.scss'

export default function MainPage() {
  // const { t } = useTranslation(['support', 'other'])
  const dispatch = useDispatch()
  const tickerList = useSelector(supportSelectors.getTicketList)

  useEffect(() => {
    dispatch(supportOperations.getTicketsHandler())
  }, [])

  return (
    <>
      <SupportFilter />
      <SupportTable list={tickerList} />
    </>
  )
}
