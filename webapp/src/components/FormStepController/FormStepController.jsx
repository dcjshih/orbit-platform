import React from 'react';
import PropTypes from 'prop-types';
import PaginationDots from '../PaginationDots';
import Button from '../Button';
import './FormStepController.sass';

function FormStepController(props) {
  const {
    currentStep,
    steps,
    nextStep,
    prevStep,
    submitLabel,
  } = props;

  // Conditional rendering flags
  const isNotFirstPage = currentStep !== 1;
  const isNotLastPage = currentStep !== steps;

  return (
    <div className="form-step-controller">
      { isNotFirstPage && (
        <Button className="prev" type="button" onClick={prevStep} label="Previous step" />
      )}
      <PaginationDots currentStep={currentStep} steps={steps} />
      { isNotLastPage && (
        <Button className="next" type="button" onClick={nextStep} label="Next step" />
      )}
      { !isNotLastPage && <Button className="next" label={submitLabel} /> }
    </div>
  );
}

FormStepController.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};

FormStepController.defaultProps = {
  submitLabel: 'Submit',
};

export default FormStepController;
