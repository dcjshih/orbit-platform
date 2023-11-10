import React from 'react';
import PropTypes from 'prop-types';
import './ToggleToken.sass';

function ToggleToken(props) {
  const { label, enabled, toggle } = props;
  let tokenClass = 'toggle-token';
  if (enabled) tokenClass += ' enabled';

  return (
    <button className={tokenClass} type="button" onClick={toggle}>
      { label }
    </button>
  );
}

ToggleToken.propTypes = {
  label: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
};

ToggleToken.defaultProps = {
  enabled: false,
};

export default ToggleToken;
