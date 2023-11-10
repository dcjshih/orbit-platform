import React from 'react';
import PropTypes from 'prop-types';
import './Tooltip.sass';

function Tooltip(props) {
  const { label } = props;
  return <div className="tooltip">{ label }</div>;
}

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Tooltip;
