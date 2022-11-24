import * as React from 'react'

const SvgComponent = props => (
  <svg width={65} height={65} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m32.5 0 5.608 9.748 9.495-6.025.436 11.238 11.208-.923L54.41 24.19l10.353 4.392-9.001 6.742 7.126 8.7-11.103 1.786 2.267 11.016-10.662-3.578-3.112 10.807-7.778-8.123-7.778 8.123-3.112-10.807-10.662 3.578 2.267-11.016-11.103-1.786 7.126-8.7-9.001-6.742L10.59 24.19 5.753 14.038l11.208.922.436-11.237 9.495 6.025L32.5 0Z"
      fill="url(#a)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={32.5}
        y1={0}
        x2={12.472}
        y2={60.323}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FB67A3" />
        <stop offset={1} stopColor="#FF51C2" />
      </linearGradient>
    </defs>
  </svg>
)

export default SvgComponent
