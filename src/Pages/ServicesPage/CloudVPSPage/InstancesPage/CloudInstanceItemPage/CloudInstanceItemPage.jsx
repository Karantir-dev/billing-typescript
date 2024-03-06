/* eslint-disable no-unused-vars */
import { useLocation, useParams } from 'react-router-dom'

export default function CloudInstanceItemPage() {
  const location = useLocation()
  const params = useParams()

  console.log(params, ' params')
  console.log(location, ' location')

  return <div>CloudInstanceItemPage</div>
}
