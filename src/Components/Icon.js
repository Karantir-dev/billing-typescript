import React from 'react'
import Icons from '../images/sprite.svg'
import PropTypes from 'prop-types'

export const Icon = ({ className, name, size }) => (
  <svg className={className} width={size} height={size}>
    <use href={`${Icons}#icon-${name}`} />
  </svg>
)

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
}
