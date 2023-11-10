import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import validateWebsite from '../../helpers/validateWebsite';
import validatePasswordMatch from '../../helpers/validatePasswordMatch';
import FormField from '../FormField';
import TextInput from '../TextInput';
import SelectGroup from '../SelectGroup';
import Grid from '../Grid';
import Alert from '../Alert';

import disciplines from '../../data/disciplines.json';

function RegisterBasics(props) {
  const {
    currentStep,
    handleChange,
    firstName,
    lastName,
    email,
    website,
    institution,
    discipline_1,
    discipline_2,
    position,
    password,
    passwordConfirmation,
  } = props;

  if (currentStep !== 1) return null;

  // Conditional rendering flags.
  const passwordMatch = validatePasswordMatch(password, passwordConfirmation);
  const validWebsite = validateWebsite(website);

  return (
    <Fragment>
      <header>
        <h1>Register for ORBIT</h1>
        <div className="header-description">
          <p>In creating your ORBIT profile, the basic information you provide about yourself and your interests will enable potential collaborators to find you. The more information you add to your profile, the easier it will be for you to find new people to contact and ideas to join.</p>
          <p>
            <span>Already have an ORBIT account? </span>
            <span>Click </span>
            <Link to="/login">here to login</Link>
            <span>.</span>
          </p>
        </div>
      </header>

      <Grid>
        <FormField
          label="Given name"
          className="col-1"
          required
        >
          <TextInput
            name="firstName"
            value={firstName}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          label="Family name"
          className="col-2"
          required
        >
          <TextInput
            name="lastName"
            value={lastName}
            onChange={handleChange}
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="Institution"
          className="col-1"
          required
        >
          <TextInput
            name="institution"
            value={institution}
            onChange={handleChange}
            placeholder="Institution"
          />
        </FormField>

        <FormField
          label="Role/Position at Institution"
          className="col-2"
          required
        >
          <TextInput
            name="position"
            value={position}
            onChange={handleChange}
            placeholder="Position"
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="Discipline"
          className="col-1"
          required
        >
          <SelectGroup
            name="discipline_1"
            value={discipline_1}
            onChange={handleChange}
            data={disciplines}
            placeholder="None"
          />
        </FormField>

        <FormField
          label="Add a second discipline"
          className="col-2"
        >
          <SelectGroup
            name="discipline_2"
            value={discipline_2}
            onChange={handleChange}
            data={disciplines}
            placeholder="None"
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="Email"
          className="content-area"
          required
        >
          <TextInput
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
          />
        </FormField>
      </Grid>

      <Grid>
        <FormField
          label="If you have a personal website or faculty web page, you can choose to link it below. (Please copy and paste the full URL including “https://“)"
          className="content-area"
        >
          <TextInput
            name="website"
            value={website}
            onChange={handleChange}
            placeholder="https://www.website.com"
          />
        </FormField>
        { !validWebsite && <Alert klass="content-area" label="Website must begin with 'http'" /> }
      </Grid>

      <Grid>
        <FormField
          label="Password"
          className="col-1"
          required
        >
          <TextInput
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
        </FormField>

        <FormField
          label="Confirm password"
          className="col-2"
          required
        >
          <TextInput
            name="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={handleChange}
          />
        </FormField>
        <p className="content-area form-field-descriptor">Passwords must be at least 8 characters and contain at least one number, uppercase letter, and lowercase letter.</p>

        { !passwordMatch && <Alert klass="content-area" label="The password and password confirmation does not match." /> }

      </Grid>

    </Fragment>
  );
}

RegisterBasics.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  passwordConfirmation: PropTypes.string,
  website: PropTypes.string,
  institution: PropTypes.string,
  position: PropTypes.string,
};

RegisterBasics.defaultProps = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  website: '',
  institution: '',
  position: '',
};

export default RegisterBasics;
