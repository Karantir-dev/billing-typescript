import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="#AE9CCD"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m15.471 6.168-2.859 1.307a4.515 4.515 0 0 1-4.104 6.382c-2.487 0-4.523-2.023-4.523-4.51A4.532 4.532 0 0 1 7.617 4.92v1.863l5.786-3.392L7.617 0v1.742C3.845 2.172.842 5.418.842 9.347c0 4.22 3.44 7.653 7.66 7.653 4.22 0 7.656-3.433 7.656-7.653a7.592 7.592 0 0 0-.687-3.18Z" />
    </svg>
  )
}
