import React from 'react';
import PropTypes from 'prop-types';

import './TextArea.sass';

function TextInput(props) {
  const {
    name,
    value,
    onChange,
    placeholder,
    required,
  } = props;

  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={!!required}
    />
  );
}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

TextInput.defaultProps = {
  placeholder: '',
  required: false,
};

export default TextInput;
