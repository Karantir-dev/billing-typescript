import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx={2} cy={10} r={2} />
      <circle cx={11} cy={10} r={2} />
      <circle cx={20} cy={10} r={2} />
    </svg>
  )
}
