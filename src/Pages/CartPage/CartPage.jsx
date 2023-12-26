import Div100vh from 'react-div-100vh'
import { AuthPageHeader } from '@pages'
import s from './CartPage.module.scss'
import { OrderTariff } from '@components'

export default function CartPage() {
  return (
    <Div100vh className={s.wrapper}>
      <AuthPageHeader />
      <div className="container">
        <OrderTariff />
      </div>
    </Div100vh>
  )
}
