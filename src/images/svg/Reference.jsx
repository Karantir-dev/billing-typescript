import * as React from 'react'

const SvgComponent = props => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 5.5A2.5 2.5 0 0 1 4.5 3h11.667a2.5 2.5 0 0 1 2.5 2.5v8.333a2.5 2.5 0 0 1-2.5 2.5H6.722a.833.833 0 0 0-.5.167l-2.889 2.167A.834.834 0 0 1 2 18V5.5Zm4.167 0a.833.833 0 1 0 0 1.667H14.5a.833.833 0 0 0 0-1.667H6.167Zm0 3.333a.833.833 0 0 0 0 1.667H14.5a.833.833 0 0 0 0-1.667H6.167Zm0 3.334a.833.833 0 1 0 0 1.666H9.5a.834.834 0 0 0 0-1.666H6.167Z"
      fill="#AE9CCD"
    />
  </svg>
)

export default SvgComponent
