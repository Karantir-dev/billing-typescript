import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={15} height={11} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 10 7.377 2 1 10" strokeWidth={2} />
    </svg>
  )
}
