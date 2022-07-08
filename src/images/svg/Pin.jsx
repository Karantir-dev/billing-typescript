import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  return (
    <svg width={17} height={34} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m11.696 17.24-.819-8.652H4.751l-.819 8.652h7.764zM14.577 20.626c0-.346-.064-.688-.19-1.008s-.309-.61-.54-.854c-.231-.245-.506-.438-.808-.571s-.626-.2-.954-.2H3.542c-.327 0-.651.068-.954.2s-.577.326-.808.571c-.231.245-.415.535-.54.854s-.19.662-.19 1.008v1.128h13.527v-1.129zM12.738 5.203H2.89l1.602 2.633h6.643l1.602-2.633zM8.881 29.743v-7.236H6.745v7.236L7.813 32l1.068-2.257z" />
      <Gradient />
    </svg>
  )
}
