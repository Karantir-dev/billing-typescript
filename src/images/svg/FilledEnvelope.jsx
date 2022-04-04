import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={25}
      height={19}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.187 11.817a3.658 3.658 0 0 1-4.063 0L.162 5.19A3.624 3.624 0 0 1 0 5.076v10.858a2.235 2.235 0 0 0 2.238 2.233h19.835a2.235 2.235 0 0 0 2.238-2.233V5.076c-.053.04-.107.078-.162.115l-9.962 6.626Z" />
      <path d="m.952 4.035 9.962 6.673a2.228 2.228 0 0 0 2.483 0l9.962-6.673a2.146 2.146 0 0 0 .952-1.787A2.245 2.245 0 0 0 22.074 0H2.237A2.245 2.245 0 0 0 0 2.249c0 .72.356 1.387.952 1.786Z" />
      <Gradient />
    </svg>
  )
}
