import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={10} height={19} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.404 19v-8.666h2.908l.436-3.379H6.404V4.8c0-.978.27-1.644 1.675-1.644l1.787-.001V.132C9.557.092 8.496 0 7.261 0 4.682 0 2.917 1.574 2.917 4.464v2.491H0v3.379h2.917V19h3.487Z"
        fill="#4267B2"
      />
    </svg>
  )
}
