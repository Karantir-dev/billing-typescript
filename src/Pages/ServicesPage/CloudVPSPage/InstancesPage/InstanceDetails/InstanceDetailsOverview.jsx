/* eslint-disable no-unused-vars */

import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InstanceDetailsOverview () {
  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const location = useLocation()
  const params = useParams()

  console.log('params: ', params)
  console.log('location: ', location)

  const { state } = location

  return (
    <div>
      here should be info about the instance
    </div>
  )
}
