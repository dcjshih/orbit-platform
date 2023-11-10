import React from 'react';
import PropTypes from 'prop-types';

import './Button.sass';

function Button(props) {
  const { type, label, className, onClick } = props;

  let buttonClass = 'button';
  if (className) buttonClass += ` ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  type: 'submit',
};


export default Button;
