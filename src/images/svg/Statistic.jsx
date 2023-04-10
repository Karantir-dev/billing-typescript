import * as React from 'react'

const SvgComponent = props => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6 8.285H2.572A.574.574 0 0 0 2 8.858v8.569c0 .318.258.572.572.572H6a.572.572 0 0 0 .572-.572v-8.57A.572.572 0 0 0 6 8.286ZM11.71 2.002H8.284a.571.571 0 0 0-.572.569v14.855c0 .318.258.573.572.573h3.428a.572.572 0 0 0 .572-.573V2.574a.572.572 0 0 0-.572-.572ZM17.43 6.57h-3.428a.57.57 0 0 0-.572.573v10.282c0 .319.257.573.572.573h3.428a.572.572 0 0 0 .572-.573V7.143a.572.572 0 0 0-.572-.573Z"
      fill="#AE9CCD"
    />
  </svg>
)

export default SvgComponent
