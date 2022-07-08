import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={16}
      height={16}
      viewBox={'0 0 16 16'}
      fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 0a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8Zm2.696 10.696a.727.727 0 0 1-1.028 0L7.486 8.514A.727.727 0 0 1 7.273 8V3.636a.727.727 0 1 1 1.454 0V7.7l1.969 1.969a.727.727 0 0 1 0 1.028Z" />
    </svg>
  )
}
