import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={117}
      height={117}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M59.5 63.3h-2.05l-.65-24.65h3.35L59.5 63.3Zm.5 8.5c-.433.433-.95.65-1.55.65-.6 0-1.117-.217-1.55-.65-.4-.433-.6-.95-.6-1.55 0-.567.2-1.067.6-1.5.433-.433.95-.65 1.55-.65.6 0 1.117.217 1.55.65.467.433.7.933.7 1.5 0 .6-.233 1.117-.7 1.55Z"
        fill="#D93F21"
      />
      <path d="M9.57 86.75 58.5 2l48.93 84.75H9.57Z" stroke="#D93F21" strokeWidth={2} />
    </svg>
  )
}
