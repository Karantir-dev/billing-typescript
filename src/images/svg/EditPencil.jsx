import * as React from 'react'

const SvgComponent = props => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)" fill="#AE9CCD">
      <path d="M15.833 10.039a.833.833 0 0 0-.833.833v6.667c0 .459-.373.833-.833.833H2.5a.834.834 0 0 1-.833-.833V5.872c0-.46.373-.833.833-.833h6.667a.833.833 0 1 0 0-1.667H2.5a2.503 2.503 0 0 0-2.5 2.5V17.54c0 1.378 1.122 2.5 2.5 2.5h11.667c1.378 0 2.5-1.122 2.5-2.5v-6.667a.833.833 0 0 0-.834-.833Z" />
      <path d="M7.813 9.279a.422.422 0 0 0-.114.212l-.59 2.947a.418.418 0 0 0 .492.49l2.945-.59a.415.415 0 0 0 .214-.113l6.593-6.594-2.946-2.945-6.594 6.593ZM19.388.648a2.085 2.085 0 0 0-2.946 0L15.29 1.802l2.946 2.946 1.153-1.154c.394-.392.61-.916.61-1.472a2.07 2.07 0 0 0-.61-1.474Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgComponent
