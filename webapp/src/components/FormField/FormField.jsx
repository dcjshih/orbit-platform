import React from 'react';
import PropTypes from 'prop-types';

import './FormField.sass';

const requiredLabel = '*';

function FormField(props) {
  const {
    className, label, children, required,
  } = props;

  return (
    <label className={className}>
      <div className="label-components">
        { !!label && <span className="label-primary">{ label }</span> }
        { !!required && <span className="label-secondary">{ requiredLabel }</span> }
      </div>
      { React.cloneElement(children, { required }) }
    </label>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
};
FormField.defaultProps = {
  label: false,
  className: '',
  required: false,
};

export default FormField;
