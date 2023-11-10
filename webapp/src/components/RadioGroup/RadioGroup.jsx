import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import './RadioGroup.sass';

function RadioGroup(props) {
  const {
    options, name, value, onChange,
  } = props;
  const elements = [];

  options.forEach((option) => {
    const iconType = (value === option.value) ? 'radio-button-checked' : 'radio-button-unchecked';
    elements.push(
      <label key={`${name}-${option.value}`} title="Search">
        <Icon type={iconType} />
        <input
          type="radio"
          name={name}
          value={option.value}
          defaultChecked={value === option.value}
          onChange={() => onChange(option.value, option.sort)}
        />
        <span>{ option.label }</span>
      </label>,
    );
  });

  return (
    <div className="radio-group">
      { elements }
    </div>
  );
}

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


export default RadioGroup;
