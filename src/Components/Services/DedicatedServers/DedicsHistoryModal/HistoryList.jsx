import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'

import s from './DedicsHistoryModal.module.scss'

export default function HistoryList({ elid }) {
  const dispatch = useDispatch()

  const [historyList, setHistoryList] = useState()

  useEffect(() => {
    dispatch(dedicOperations.getServiceHistory(elid, setHistoryList))
  })

  return (
    <div>
      {historyList.map(item => console.log(item))}
      <li className={s.item}>list</li>
    </div>
  )
}
