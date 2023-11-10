import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './Checkbox.sass';

function Checkbox(props) {
  const {
    name,
    label,
    checked,
    onChange,
  } = props;

  // Conditional rendering flag
  const iconType = checked ? 'checkbox-checked' : 'checkbox';

  return (
    <label className="checkbox">
      <Icon type={iconType} />
      <input
        name={name}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <span>{ label }</span>
    </label>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

Checkbox.defaultProps = {
  checked: false,
  label: '',
};

export default Checkbox;
