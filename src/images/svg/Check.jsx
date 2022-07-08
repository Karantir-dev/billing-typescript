import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#D3CDDB"
      {...props}
    >
      <path d="M1 6.176 5.53 12 12 1" strokeWidth={2} strokeLinecap="round" />
      <Gradient />
    </svg>
  )
}
