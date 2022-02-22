import React from 'react'
import Icons from '../images/sprite.svg'
import PropTypes from 'prop-types'

export const Icon = ({ className, name, width, height }) => (
  <svg className={className} width={width} height={height}>
    <use href={`${Icons}#icon-${name}`} />
  </svg>
)

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
}
