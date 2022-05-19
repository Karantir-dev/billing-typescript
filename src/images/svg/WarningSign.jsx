import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  return (
    <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 0C4.026 0 0 4.025 0 9c0 4.974 4.025 9 9 9 4.974 0 9-4.025 9-9 0-4.974-4.025-9-9-9Zm.924 12.573c0 .284-.414.568-.924.568-.533 0-.912-.284-.912-.568V8.059c0-.332.38-.557.912-.557.51 0 .924.225.924.557v4.514ZM9 6.413c-.545 0-.971-.403-.971-.854 0-.45.426-.84.971-.84.533 0 .96.39.96.84 0 .45-.427.853-.96.853Z" />

      <Gradient />
    </svg>
  )
}
