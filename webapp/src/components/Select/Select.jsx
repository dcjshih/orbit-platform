import React from 'react';
import PropTypes from 'prop-types';
import './Select.sass';

function Select(props) {
  const {
    options,
    name,
    value,
    onChange,
    placeholder,
    multiple,
    required,
  } = props;

  const optionElements = [];
  options.forEach((option) => {
    const { id, label } = option;
    optionElements.push(<option key={id} value={id}>{label}</option>);
  });

  // Conditional rendering flags
  const multipleValues = (typeof value !== 'string') || multiple === 'true';

  // Determine what classes to apply
  let selectClass = 'select';
  if (multipleValues) selectClass += ' multiple';

  return (
    <select
      value={value}
      name={name}
      onChange={onChange}
      multiple={multipleValues}
      className={selectClass}
      required={required}
    >
      <option value="" disabled>{placeholder}</option>
      { optionElements }
    </select>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  multiple: PropTypes.string,
  required: PropTypes.bool,
};

Select.defaultProps = {
  placeholder: 'Select one',
  multiple: '',
  required: false,
};

export default Select;
