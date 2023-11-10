import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import FormField from '../FormField';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import Select from '../Select';
import Grid from '../Grid';
import ClassComposer from '../ClassComposer';

import collaborationTypes from '../../data/collaborationTypes.json';
import timezones from '../../data/timezones.json';
import languageList from '../../data/languages.json';
import communicationList from '../../data/communication.json';

function RegisterDetails(props) {
  const {
    currentStep, handleChange, bio, collaboration, timezone, languages,
    communication, interests, classes, updateClass, addClass,
    deleteClass, twitter, facebook, linkedin, instagram, photo,
  } = props;

  if (currentStep !== 3) return null;

  // Timezone
  const timezoneOptions = timezones.map((zone) => ({
    id: zone.name,
    label: `${zone.description} (${zone.name})`,
  }));

  // Language preferences
  const languageOptions = languageList.map((type) => ({
    id: type,
    label: type,
  }));

  // Communication methods
  const communicationOptions = communicationList.map((method) => ({
    id: method,
    label: method,
  }));

  return (
    <Fragment>
      <header>
        <h1>Profile details</h1>
      </header>

      <Grid>
        <FormField
          label="Add some more personality to your profile with an optional profile image. It doesn’t need to be photographic. (.PNG, .JPG, less than 1MB)"
          className="content-area"
        >
          <input
            type="file"
            name="photo"
            accept="image/png, image/jpeg"
            onChange={handleChange}
          />
        </FormField>
      </Grid>
      <Grid>
        <p className="content-area">Use the space below to write or paste a short bio about yourself. You can let others know your interests, background, and passions in your own voice, and explain some of your goals and interests in more detail. If you have specific collaboration ideas, you can write about those later in the Create Idea section. This bio is all about you. (250 words max.)</p>
      </Grid>
      <Grid>
        <FormField
          label="Short bio"
          className="content-area"
          required
        >
          <TextArea
            name="bio"
            value={bio}
            onChange={handleChange}
            placeholder="Please write a short description about yourself and interests here"
          />
        </FormField>
      </Grid>
      <Grid>
        <FormField
          label="Desired collaboration type"
          className="col-1"
          required
        >
          <Select
            name="collaboration"
            value={collaboration}
            onChange={handleChange}
            options={collaborationTypes}
          />
        </FormField>

        <FormField
          label="Please select your timezone"
          className="col-2"
          required
        >
          <Select
            name="timezone"
            value={timezone}
            onChange={handleChange}
            options={timezoneOptions}
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
          label="What language or languages do you feel comfortable communicating in? (Please select all that apply)."
          className="content-area"
        >
          <Select
            name="languages"
            placeholder="Select one or more"
            value={languages}
            onChange={handleChange}
            options={languageOptions}
            multiple="true"
          />
        </FormField>
      </Grid>

      <Grid>
        <h3 className="content-area">Social media</h3>
        <p className="content-area">(Please copy and paste the full URL including “https://“)</p>
        <br />
        <br />

        <FormField
          label="Twitter"
          className="col-1"
        >
          <TextInput
            name="twitter"
            value={twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/username/"
          />
        </FormField>
        <FormField
          label="Facebook"
          className="col-2"
        >
          <TextInput
            name="facebook"
            value={facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/username/"
          />
        </FormField>
      </Grid>
      <Grid>
        <FormField
          label="LinkedIn"
          className="col-1"
        >
          <TextInput
            name="linkedin"
            value={linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username/"
          />
        </FormField>
        <FormField
          label="Instagram"
          className="col-2"
        >
          <TextInput
            name="instagram"
            value={instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/username/"
          />
        </FormField>
      </Grid>

      <Grid>
        <h3 className="content-area">Communication preferences</h3>
        <FormField
          label="What are your preferred modes of communication for working with future collaborators?"
          className="content-area"
          required
        >
          <Select
            name="communication"
            placeholder="Select one or more"
            value={communication}
            onChange={handleChange}
            options={communicationOptions}
            multiple="true"
          />
        </FormField>
      </Grid>

      <Grid>
        <h3 className="content-area">Courses</h3>
        <p className="content-area">For teaching collaborations, please indicate the name, start, and end dates of course(s) for which you’d like to organize a collaboration or virtual exchange.</p>
        <ClassComposer
          classes={classes}
          updateClass={updateClass}
          addClass={addClass}
          deleteClass={deleteClass}
        />
      </Grid>
    </Fragment>
  );
}

RegisterDetails.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  bio: PropTypes.string,
  collaboration: PropTypes.string,
};

RegisterDetails.defaultProps = {
  bio: '',
  collaboration: '',
};

export default RegisterDetails;
