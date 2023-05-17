import * as React from 'react'
const SvgComponent = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      fill="#B3A9C1"
      d="M15.484 3.125h-2.921v-.531c0-.88-.714-1.594-1.594-1.594H8.844c-.88 0-1.594.714-1.594 1.594v.531H4.328C3.595 3.125 3 3.72 3 4.453v1.063c0 .293.238.53.531.53h12.75a.531.531 0 0 0 .532-.53V4.453c0-.733-.595-1.328-1.329-1.328Zm-7.171-.531c0-.293.238-.531.53-.531h2.126c.293 0 .531.238.531.53v.532H8.312v-.531ZM4.01 7.11c-.095 0-.17.079-.166.173l.438 9.199c.04.851.74 1.518 1.592 1.518h8.068c.852 0 1.55-.667 1.591-1.518l.439-9.199a.166.166 0 0 0-.166-.174H4.01Zm8.023 1.327a.531.531 0 1 1 1.062 0v6.907a.531.531 0 1 1-1.062 0V8.438Zm-2.656 0a.531.531 0 1 1 1.062 0v6.907a.531.531 0 1 1-1.062 0V8.438Zm-2.657 0a.531.531 0 1 1 1.063 0v6.907a.531.531 0 1 1-1.063 0V8.438Z"
    />
  </svg>
)
export default SvgComponent
