import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg width={19} height={19} fill="none" {...props}>
      <path
        d="M14.414 10.475c-.014-.014-.013-.013 0 0ZM.421 7.848l.945-.227c.205-.897.56-1.75 1.054-2.542l-.479-.804a.557.557 0 0 1 .085-.678l1.569-1.57a.557.557 0 0 1 .678-.084l.804.479A8.274 8.274 0 0 1 7.62 1.368l.227-.945a.557.557 0 0 1 .54-.421h2.226c.255 0 .478.174.54.421l.227.945c.896.205 1.749.56 2.541 1.054l.804-.479a.557.557 0 0 1 .678.085l1.57 1.569c.18.18.215.46.084.678l-.478.804a8.273 8.273 0 0 1 1.053 2.542l.945.227a.557.557 0 0 1 .422.54v2.226a.556.556 0 0 1-.422.54l-.945.227a8.117 8.117 0 0 1-.608 1.713c-.409-.41-2.462-2.473-2.61-2.62.008-.037.088-.75.09-.89a5.003 5.003 0 0 0-5.006-5.092 4.989 4.989 0 0 0-5.001 5.026c.012 2.57 1.929 4.756 4.607 4.956.116.009.64.086 1.37-.058l2.612 2.613a8.113 8.113 0 0 1-1.706.604l-.227.945a.557.557 0 0 1-.54.422H8.386a.556.556 0 0 1-.54-.422l-.227-.944a8.276 8.276 0 0 1-2.542-1.054l-.804.478a.558.558 0 0 1-.678-.084l-1.57-1.57a.557.557 0 0 1-.084-.678l.479-.804a8.259 8.259 0 0 1-1.054-2.542l-.944-.226a.556.556 0 0 1-.422-.54V8.388c0-.256.174-.478.421-.54Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
      <path
        d="M5.733 8.483a.55.55 0 0 1 .922-.253l1.27 1.27a1.114 1.114 0 0 0 1.574-1.574l-1.27-1.27a.55.55 0 0 1 .252-.922c2.349-.597 4.462.933 4.85 3.045a3.941 3.941 0 0 1-.159 2.027l5.34 5.34a1.68 1.68 0 0 1-.01 2.378 1.685 1.685 0 0 1-2.358-.01l-5.34-5.34c-.855.305-1.808.299-2.742-.03-1.681-.594-2.858-2.585-2.33-4.661Z"
        fill={darkTheme ? '#DECBFE' : '#AE9CCD'}
      />
    </svg>
  )
}
