import React from 'react';
import PropTypes from 'prop-types';
import './Alert.sass';

function Alert(props) {
  const { variant, klass, label } = props;

  return (
    <div className={`alert ${variant} ${klass}`}>
      { label }
    </div>
  );
}

Alert.propTypes = {
  variant: PropTypes.string,
  klass: PropTypes.string,
  label: PropTypes.string.isRequired,
};

Alert.defaultProps = {
  variant: 'danger',
  klass: '',
};

export default Alert;
