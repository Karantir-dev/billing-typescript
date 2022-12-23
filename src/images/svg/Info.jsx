import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 0C4.057 0 0 4.057 0 9s4.057 9 9 9 9-4.057 9-9-4.057-9-9-9Zm1.055 13.219a1.056 1.056 0 0 1-2.11 0V7.945a1.056 1.056 0 0 1 2.11 0v5.274ZM9 5.836A1.056 1.056 0 0 1 7.945 4.78a1.056 1.056 0 0 1 2.11 0c0 .582-.474 1.055-1.055 1.055Z" />
    </svg>
  )
}
