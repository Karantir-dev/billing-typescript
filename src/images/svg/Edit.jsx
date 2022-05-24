import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg width={15} height={15} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
        d="M9.263 2.52 1.01 10.773a.33.33 0 0 0-.086.151L.01 14.596a.326.326 0 0 0 .315.403.32.32 0 0 0 .078-.01l3.672-.914a.324.324 0 0 0 .15-.086l8.255-8.253L9.263 2.52ZM14.524 1.395l-.918-.92c-.614-.613-1.685-.613-2.298 0l-1.125 1.126 3.216 3.217 1.125-1.126c.307-.306.476-.715.476-1.149 0-.434-.17-.842-.476-1.148Z"
      />
    </svg>
  )
}
