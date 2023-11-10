import React from 'react';
import PropTypes from 'prop-types';
import './Grid.sass';

function Grid(props) {
  const { className, children } = props;

  let gridClass = 'grid';
  if (className.length > 0) gridClass += ` ${className}`;

  return (
    <div className={gridClass}>
      { children }
    </div>
  );
}

Grid.propTypes = {
  className: PropTypes.string,
};

Grid.defaultProps = {
  className: '',
};

export default Grid;
