import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={88} height={88} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M33 44.794 42.72 57.5 55.5 30"
        stroke="#45A884"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={44} cy={44} r={43} stroke="#45A884" strokeWidth={2} />
    </svg>
  )
}
