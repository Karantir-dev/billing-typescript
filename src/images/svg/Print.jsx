import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        className={className}
        fill="#DECBFE"
        d="M12.89 15.618H7.112a.667.667 0 0 0 0 1.334h5.778a.667.667 0 0 0 0-1.334ZM12.89 13.516H7.112a.667.667 0 1 0 0 1.333h5.778a.667.667 0 0 0 0-1.333Z"
      />
      <path
        className={className}
        fill="#DECBFE"
        d="M18.445 5.23h-2.122V1.373a.667.667 0 0 0-.666-.666H4.343a.667.667 0 0 0-.666.666v3.859H1.556C.698 5.23 0 5.928 0 6.786v6.707c0 .858.698 1.556 1.556 1.556h2.12v3.579c0 .368.3.666.668.666h11.312a.667.667 0 0 0 .667-.666v-3.58h2.122c.857 0 1.555-.697 1.555-1.555V6.786c0-.857-.698-1.555-1.555-1.555ZM5.01 2.04h9.98V5.23H5.01V2.039Zm9.98 15.922H5.01v-5.454h9.98v5.454Zm.667-8.816H13.96a.667.667 0 1 1 0-1.333h1.697a.667.667 0 0 1 0 1.333Z"
      />
      <Gradient />
    </svg>
  )
}
