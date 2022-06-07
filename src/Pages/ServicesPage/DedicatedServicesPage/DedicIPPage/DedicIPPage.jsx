import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { BreadCrumbs } from '../../../../Components'
import { useLocation } from 'react-router-dom'

import s from './DedicIPPage.module.scss'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { useDispatch } from 'react-redux'
import DedicIPList from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPList/DedicIPList'

export default function DedicIPpage() {
  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const dispatch = useDispatch()
  const [IPList, setIPList] = useState([])

  useEffect(() => {
    dispatch(dedicOperations.getIPList('3568378', setIPList)) // to get ID
  }, [])

  return (
    <div className={s.page_container}>
      <BreadCrumbs pathnames={parseLocations()} />
      <DedicIPList IPList={IPList} />
    </div>
  )
}
