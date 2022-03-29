import React from 'react'
import Icons from '../images/sprite.svg'
import PropTypes from 'prop-types'

export const Icon = ({ className, name, width, height, isGradient }) => (
  <svg
    className={className}
    width={width}
    height={height}
    fill={isGradient ? 'url(#gradient)' : ''}
  >
    {isGradient && (
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#FF59A9" />
        <stop offset="100%" stop-color="#E238D7" />
      </linearGradient>
    )}
    <use href={`${Icons}#icon-${name}`} />
  </svg>
)

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  isGradient: PropTypes.bool,
}
