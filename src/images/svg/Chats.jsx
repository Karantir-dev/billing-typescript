import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux/selectors'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg width={21} height={21} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#a)" fill={darkTheme ? '#DECBFE' : '#D9D0EB'}>
        <path d="M16.879 19.89a.71.71 0 0 1 .493.2 3.29 3.29 0 0 0 3.244.764 6.285 6.285 0 0 1-.262-4.817c.694-1.982.867-3.97.078-5.962a7.646 7.646 0 0 0-3.724-4.034c.104.555.156 1.12.156 1.693 0 2.427-.933 4.71-2.628 6.428a9.119 9.119 0 0 1-6.397 2.72 9.2 9.2 0 0 1-1.345-.078 7.784 7.784 0 0 0 6.623 3.908 7.676 7.676 0 0 0 3.456-.753.708.708 0 0 1 .306-.069Z" />
        <path d="M7.906.002C3.595-.084.01 3.404 0 7.715a7.673 7.673 0 0 0 .628 3.077 6.285 6.285 0 0 1-.263 4.816 3.29 3.29 0 0 0 3.245-.764.71.71 0 0 1 .798-.13 7.665 7.665 0 0 0 3.457.752c4.278-.063 7.629-3.46 7.628-7.732 0-4.18-3.403-7.648-7.587-7.732ZM3.615 8.889a1.12 1.12 0 1 1-.002-2.242 1.12 1.12 0 0 1 .002 2.242Zm4.132 0a1.12 1.12 0 1 1-.002-2.242 1.12 1.12 0 0 1 .002 2.242Zm4.132 0a1.12 1.12 0 1 1-.002-2.242 1.12 1.12 0 0 1 .002 2.242Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h21v21H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
