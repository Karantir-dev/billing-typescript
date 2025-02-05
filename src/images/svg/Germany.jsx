const SvgComponent = props => (
  <svg width={21} height={21} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21 8.207H0V3.983c0-.2.162-.362.362-.362h20.276c.2 0 .362.162.362.362v4.224Z"
      fill="#464655"
    />
    <path
      d="M20.638 17.38H.362A.362.362 0 0 1 0 17.016v-4.224h21v4.224c0 .2-.162.362-.362.362Z"
      fill="#FFE15A"
    />
    <path d="M21 8.207H0v4.586h21V8.207Z" fill="#FF4B55" />
  </svg>
)

export default SvgComponent
