import React from 'react';
import PropTypes from 'prop-types';

import './TextInput.sass';

function TextInput(props) {
  const {
    name,
    value,
    type,
    onChange,
    placeholder,
    required,
  } = props;

  return (
    <input
      name={name}
      value={value}
      type={type || 'text'}
      onChange={onChange}
      placeholder={placeholder}
      required={!!required}
    />
  );
}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

TextInput.defaultProps = {
  value: '',
  type: 'text',
  placeholder: '',
  required: false,
};

export default TextInput;
