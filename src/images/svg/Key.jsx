import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={19} height={11} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.061 3.455A5.178 5.178 0 0 0 0 5.182a5.178 5.178 0 0 0 10.061 1.727h3.757v3.455h3.455V6.909H19V3.455h-8.939Zm-4.88 3.454a1.727 1.727 0 1 1 0-3.454 1.727 1.727 0 0 1 0 3.454Z" />
    </svg>
  )
}
