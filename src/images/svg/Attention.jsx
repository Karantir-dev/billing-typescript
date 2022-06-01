import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={10} cy={10} r={10} fill="#FA6848" />
      <path
        d="M10.944 11.528H9.152l-.336-7.2h2.448l-.32 7.2Zm.016 3.248c-.256.256-.56.384-.912.384s-.656-.128-.912-.384a1.254 1.254 0 0 1-.368-.896c0-.352.123-.656.368-.912.256-.256.56-.384.912-.384s.656.128.912.384.384.56.384.912c0 .341-.128.64-.384.896Z"
        fill="#fff"
      />
    </svg>
  )
}
