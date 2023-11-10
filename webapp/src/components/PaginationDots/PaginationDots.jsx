import React from 'react';
import PropTypes from 'prop-types';
import './PaginationDots.sass';

function PaginationDots(props) {
  const { currentStep, steps } = props;
  const dots = [];

  for (let i = 0; i < steps; i += 1) {
    let klass = 'pagination-dot';
    if ((i + 1) === currentStep) klass += ' active';
    dots.push(<span key={i} className={klass} />);
  }

  // Do not render if there are no steps
  if (!steps) return null;

  return (
    <div className="pagination-dots">
      { dots }
    </div>
  );
}

PaginationDots.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
};

export default PaginationDots;
