import * as React from 'react'
const SvgComponent = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} fill="none" {...props}>
    <g clipPath="url(#a)">
      <path
        fill="#B3A9C1"
        d="M8.5 0A8.5 8.5 0 1 0 17 8.5 8.511 8.511 0 0 0 8.5 0Zm-.213 13.231a.864.864 0 1 1 0-1.728.864.864 0 0 1 0 1.728Zm1.48-4.146a1.08 1.08 0 0 0-.76 1.037.72.72 0 1 1-1.44 0A2.515 2.515 0 0 1 9.34 7.708a1.083 1.083 0 0 0 .764-1.038 1.605 1.605 0 0 0-3.207 0 .72.72 0 1 1-1.44 0 3.046 3.046 0 0 1 6.088 0 2.518 2.518 0 0 1-1.778 2.415Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h17v17H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgComponent
