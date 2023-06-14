const SvgComponent = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} fill="none" {...props}>
    <circle cx={18} cy={18} r={18} fill="#FA6848" fillOpacity={0.07} />
    <circle cx={18} cy={18} r={12} fill="#FA6848" fillOpacity={0.15} />
    <path fill="url(#a)" d="M15.555 22.947h4.153v.23a2.077 2.077 0 0 1-4.153 0v-.23Z" />
    <path
      fill="url(#b)"
      d="m23.985 20.746-1.137-1.137a1.49 1.49 0 0 1-.437-1.054v-2.06a4.685 4.685 0 0 0-3.818-4.603v-.93a.963.963 0 0 0-1.925 0v.93a4.685 4.685 0 0 0-3.819 4.604v2.06c0 .395-.157.773-.436 1.053l-1.137 1.138a.94.94 0 0 0 .665 1.606h11.38a.941.941 0 0 0 .665-1.606Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={17.82}
        x2={17.818}
        y1={23.226}
        y2={25.254}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6F66" />
        <stop offset={0.982} stopColor="#FA487D" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={18.232}
        x2={18.219}
        y1={11.491}
        y2={22.353}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6F66" />
        <stop offset={0.982} stopColor="#FA487D" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgComponent
