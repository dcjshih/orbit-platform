import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import validateWebsite from '../../helpers/validateWebsite';

// Components
import FormField from '../FormField';
import TextInput from '../TextInput';
import TextArea from '../TextArea';
import Select from '../Select';
import Alert from '../Alert';
import Grid from '../Grid';

// Load data
import communicationList from '../../data/communication.json';
import collaborationTypes from '../../data/collaborationTypes.json';

function CreateIdeaFormBasics(props) {
  const {
    currentStep,
    handleChange,
    toggleListItem,
    title,
    website,
    duration,
    description,
    communication,
    interests,
    collaboration,
  } = props;

  if (currentStep !== 1) return null;

  // Communication
  const communicationOptions = communicationList.map((type) => ({
    id: type,
    label: type,
  }));

  const validWebsite = validateWebsite(website);

  return (
    <Fragment>
      <header>
        <h1>Create an Idea, share it with the world, find collaborators!</h1>
        <div className="header-description">
          <p>If you already have an idea for a teaching or research collaboration, you can share it with the ORBIT community here.  Potential collaborators can browse and contact you about joining your idea, and you can review requests and decide who to add to your project. Note that we encourage you to communicate with each other prior to accepting requests to join projects, so please take the initiative to start a conversation by emailing people using the Contact link on their profile page.</p>
        </div>
      </header>

      <Grid>
        <FormField
          label="Title"
          className="col-1"
          required
        >
          <TextInput
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Descriptive title"
          />
        </FormField>
        <FormField
          label="Website"
          className="col-2"
        >
          <TextInput
            name="website"
            value={website}
            onChange={handleChange}
            placeholder="https://www.domain.com"
          />
        </FormField>
        { !validWebsite && <Alert klass="content-area" label="Website must begin with 'http'" /> }
      </Grid>

      <Grid>
        <p className="content-area">How would you describe this idea if you were introducing it to a friend for the first time? Please share any important descriptive details about your collaboration opportunity. (e.g.. What outcome do you want to see? What kind of collaborators are you looking for? What progress has been made on the idea so far—or are you looking to start something fresh?)</p>
        <FormField
          label="Description"
          className="content-area"
          required
        >
          <TextArea
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Please write a brief description of your idea here. (250 characters or less)"
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="Please add at least 3 keywords that generally describe your teaching or research interests. (Use a semicolon (;) between each item.)"
          className="content-area"
        >
          <TextInput
            name="interests"
            value={interests}
            onChange={handleChange}
            placeholder="Separate by semicolon (;)"
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="How long do you think this collaboration would last?"
          className="content-area"
          required
        >
          <TextInput
            name="duration"
            value={duration}
            onChange={handleChange}
            placeholder="E.g., 2 weeks, 4 months, undetermined"
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="Desired collaboration type:"
          className="content-area"
          required
        >
          <Select
            name="collaboration"
            value={collaboration}
            onChange={handleChange}
            options={collaborationTypes}
          />
        </FormField>
      </Grid>


      <Grid>
        <FormField
          label="What are your preferred modes of communication for working with future collaborators?"
          className="content-area"
          required
        >
          <Select
            name="communication"
            placeholder="Select all that apply"
            value={communication}
            onChange={handleChange}
            options={communicationOptions}
            multiple="true"
          />
        </FormField>
      </Grid>

    </Fragment>
  );
}

CreateIdeaFormBasics.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  website: PropTypes.string,
};

CreateIdeaFormBasics.defaultProps = {
  title: '',
  website: '',
};

export default CreateIdeaFormBasics;
