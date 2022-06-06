import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux'
import { BreadCrumbs } from '../../../../Components'
import { useLocation } from 'react-router-dom'

import s from './DedicIPPage.module.scss'

export default function DedicIPpage() {
  //   const dispatch = useDispatch()

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  useEffect(() => {
    console.log('first render')
  }, [])

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      {/* <h2 className={s.page_title}>{t('page_title')}</h2> */}
    </div>
  )
}
