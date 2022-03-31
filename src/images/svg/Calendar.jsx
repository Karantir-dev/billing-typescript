import * as React from 'react'

export default function SvgComponent(props) {
  const { darktheme } = props

  return (
    <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#a)" fill={darktheme ? '#DECBFE' : '#AE9CCD'}>
        <path d="M.527 13.746h13.781a.529.529 0 0 0 .338-.122c.133-.11 3.152-2.709 3.336-8.316H3.181C2.997 10.398.217 12.79.188 12.814a.529.529 0 0 0 .339.932ZM17.473 2.144h-2.637v-.527a.522.522 0 0 0-.528-.528.522.522 0 0 0-.527.528v.527h-2.672v-.527a.522.522 0 0 0-.527-.528.522.522 0 0 0-.528.528v.527H7.417v-.527a.522.522 0 0 0-.527-.528.522.522 0 0 0-.527.528v.527H3.726a.522.522 0 0 0-.528.527v1.583H18V2.67a.522.522 0 0 0-.527-.527Z" />
        <path d="M15.323 14.432a1.587 1.587 0 0 1-1.015.369H3.198v1.582c0 .291.236.527.528.527h13.747a.527.527 0 0 0 .527-.527V10.47c-1.017 2.495-2.436 3.76-2.677 3.961Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
