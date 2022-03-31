import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={18}
      height={14}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 0v13.188h17.313V0H0Zm15.498 1.014L8.656 7.26l-6.84-6.246h13.682Zm.8 11.16H1.014V1.656l7.642 6.976 7.642-6.976v10.516Z"
        fill="#C4C4C4"
      />
    </svg>
  )
}
