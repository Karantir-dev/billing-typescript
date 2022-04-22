import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={13} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 6.176 5.53 12 12 1"
        stroke="#D3CDDB"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}
