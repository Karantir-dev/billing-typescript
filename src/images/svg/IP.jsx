import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={15}
      height={13}
      viewBox="0 0 15 13"
      fill="#AE9CCD"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.744 13H.188V.994h2.556V13Zm4.94 0H5.126V.994h5.616c1.26 0 2.245.372 2.952 1.116.72.732 1.08 1.65 1.08 2.754 0 1.092-.36 2.01-1.08 2.754-.72.744-1.704 1.116-2.952 1.116h-3.06V13Zm2.718-6.516c.516 0 .936-.144 1.26-.432.335-.3.503-.696.503-1.188s-.167-.882-.503-1.17c-.325-.3-.745-.45-1.26-.45H7.683v3.24h2.719Z" />
    </svg>
  )
}
