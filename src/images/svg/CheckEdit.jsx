const SvgComponent = props => (
  <svg width={13} height={15} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 6.455 5.53 13 12 1"
      stroke="url(#a)"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="a" x1={12} y1={1} x2={1} y2={1} gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF42A8" />
        <stop offset={1} stopColor="#E030BD" />
      </linearGradient>
    </defs>
  </svg>
)

export default SvgComponent
