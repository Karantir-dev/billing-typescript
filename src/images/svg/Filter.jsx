import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent() {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={15} height={16} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.074 7.897c.252.364.177.061.177 7.313a.79.79 0 0 0 1.262.632c2.23-1.681 2.675-1.827 2.675-2.613 0-5.285-.061-4.987.176-5.332l3.621-4.928H1.454l3.62 4.928ZM14.353.402A.745.745 0 0 0 13.691 0H.748a.747.747 0 0 0-.612 1.175l.629.856h12.909c.57-.775.95-1.11.679-1.63Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
    </svg>
  )
}
