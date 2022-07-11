import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  return (
    <svg width={22} height={25} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="gray">
        <path d="M5.19 8.712V1.879h11.957l-3.416 3.416 3.416 3.417H5.19Z" />
        <path d="M5 17c-.265 0-.52-.09-.707-.249A.791.791 0 0 1 4 16.15V.85c0-.225.105-.442.293-.601C4.48.089 4.735 0 5 0c.265 0 .52.09.707.249.188.16.293.376.293.601v15.3a.791.791 0 0 1-.293.601C5.52 16.911 5.265 17 5 17Z" />
        <path d="M17.146 9.56H5.188a.854.854 0 0 1 0-1.707h9.896l-1.958-1.959a.854.854 0 0 1 0-1.208l1.958-1.958H5.188a.854.854 0 1 1 0-1.708h11.958a.854.854 0 0 1 .604 1.458L14.937 5.29l2.813 2.813a.854.854 0 0 1-.604 1.458Z" />
      </g>

      <Gradient />
    </svg>
  )
}