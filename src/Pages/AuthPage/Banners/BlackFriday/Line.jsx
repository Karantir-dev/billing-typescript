const SvgComponent = props => (
  <svg width={471} height={1} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path stroke="url(#a)" strokeDasharray="6 6" d="M0 .5h471" />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        y1={1.5}
        x2={217.755}
        y2={236.331}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FE00EC" />
        <stop offset={0.982} stopColor="#A65FFC" />
      </linearGradient>
    </defs>
  </svg>
)

export default SvgComponent
