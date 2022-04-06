import React from 'react'
// import { useDispatch } from 'react-redux'

import { AsideServicesMenu, Header } from '../../Components'
// import { actions } from '../../Redux/actions'

import s from './MainPage.module.scss'

export default function MainPage() {
  // const dispatch = useDispatch()
  // dispatch(actions.showLoader())
  // // const isLoaded = useSelector(state => state.isLoading)

  // const handleLoading = () => {
  //   dispatch(actions.hideLoader())
  // }

  // useEffect(() => {
  //   window.addEventListener('load', handleLoading)
  //   return () => window.removeEventListener('load', handleLoading)
  // }, [])
  return (
    <>
      <>
        {true && (
          <>
            <div className={s.aside_menu_container}>
              <AsideServicesMenu />
            </div>
            <Header />
          </>
        )}
      </>
    </>
  )
}
