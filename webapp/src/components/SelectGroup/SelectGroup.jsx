import React from 'react';
import PropTypes from 'prop-types';

function Select(props) {
  const {
    data,
    name,
    value,
    onChange,
    placeholder,
    required,
  } = props;

  const optionElements = [];
  data.forEach((group) => {
    const options = [];
    group.disciplines.forEach((discipline) => {
      options.push(<option key={`${group.category}-${discipline}`} value={discipline}>{discipline}</option>);
    });
    optionElements.push((
      <optgroup key={group.category} label={group.category}>
        { options }
      </optgroup>
    ));
  });

  const currentValue = value.length > 0 ? value : '';

  return (
    <select
      value={currentValue}
      name={name}
      onChange={onChange}
      className="select"
      required={required}
    >
      <option value="" disabled>{placeholder}</option>
      { optionElements }
    </select>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      disciplines: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

Select.defaultProps = {
  placeholder: 'Select one',
  required: false,
};

export default Select;
