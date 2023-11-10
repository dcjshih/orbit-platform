import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ToggleToken from '../ToggleToken';
import Grid from '../Grid';
import './CreateIdeaFormUNGoals.sass';

function CreateIdeaFormUNGoals(props) {
  const {
    currentStep,
    goals,
    unGoals,
    toggleListItem,
  } = props;

  if (currentStep !== 2) return null;

  const officialList = [];
  const unofficialList = [];
  unGoals.forEach((goal) => {
    const enabled = goals.includes(goal.id);

    const element = (
      <ToggleToken
        key={goal.id}
        label={goal.label}
        enabled={enabled}
        toggle={() => toggleListItem(goal.id, 'goals')}
      />
    );

    if (goal.official) {
      officialList.push(element);
    } else {
      unofficialList.push(element);
    }
  });

  return (
    <Fragment>
      <header>
        <h1>Collaboration Goals</h1>
        <div className="header-description">
          <p>
            <span>Please select 1–3 of the goals on this page that best align with your teaching and research interests. You can also suggest more goals using </span>
            <a href="https://forms.gle/uABCHNbUQ9fpxTcd8" target="_blank" rel="noreferrer">this form</a>
            <span>.</span>
          </p>
          <p>People who have goals in common with yours will appear at the top of your ‘Explore People’ page.</p>
          <p>The number of goals you have in common will be indicated by black bullet points in the bottom right corner of a person’s card.</p>
        </div>
      </header>

      <div className="goals-list">
        <Grid>
          <h3 className="content-area">UN Sustainable Development goals</h3>
          <p className="content-area">
            <span>This list is based upon the </span>
            <a href="https://unfoundation.org/what-we-do/issues/sustainable-development-goals/?gclid=Cj0KCQjwpNr4BRDYARIsAADIx9xhejCGbnEafRjtUxyBFjfU84jphiZp74NBygvwpZ9BB3Enz2MIo7UaAo9OEALw_wcB" target="_blank" rel="noreferrer">United Nations’ Sustainable Development Goals</a>
            <span>, which they created to unify the way people around the world think about change.</span>
          </p>
        </Grid>
        { officialList }
      </div>

      <div className="goals-list">
        <Grid>
          <h3 className="content-area">Additional Goals (Non-UN):</h3>
        </Grid>
        { unofficialList }
      </div>
    </Fragment>
  );
}

CreateIdeaFormUNGoals.propTypes = {
  currentStep: PropTypes.number.isRequired,
  toggleListItem: PropTypes.func.isRequired,
};

CreateIdeaFormUNGoals.defaultProps = {
  goals: [],
  unGoals: [],
};

export default CreateIdeaFormUNGoals;
