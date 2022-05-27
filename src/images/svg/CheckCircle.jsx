import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="#fff"
      strokeWidth={0}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={10} cy={10} r={10} fill="#F79649" />
      <path d="M6 9.111 9.063 13 13 6" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}
