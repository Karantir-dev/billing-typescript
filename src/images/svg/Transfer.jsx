import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg width={18} height={18} fill="none" {...props}>
      <path
        d="M17.438 11.25a.563.563 0 0 1-.563-.563 3.942 3.942 0 0 0-3.938-3.937H7.5v2.438a.563.563 0 0 1-.951.406L2.424 5.657a.562.562 0 0 1 0-.813L6.549.906a.563.563 0 0 1 .951.407V3.75h4.688A5.82 5.82 0 0 1 18 9.563v1.124c0 .311-.252.563-.563.563Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
      <path
        d="M10.5 16.688V14.25H5.812A5.82 5.82 0 0 1 0 8.437V7.313a.563.563 0 0 1 1.125 0 3.942 3.942 0 0 0 3.938 3.937H10.5V8.812c0-.492.593-.748.951-.406l4.125 3.938a.562.562 0 0 1 0 .813l-4.125 3.937a.563.563 0 0 1-.951-.407Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
    </svg>
  )
}
