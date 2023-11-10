import React, { Component } from 'react';
import axios from 'axios';

import Page from '../../components/Page';
import RegisterBasics from '../../components/RegisterBasics';
import RegisterDetails from '../../components/RegisterDetails';
import RegisterUNGoals from '../../components/RegisterUNGoals';
import FormStepController from '../../components/FormStepController';

import './RegisterRoute.sass';

class RegisterRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      steps: 3,
      alert: '',
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      institution: '',
      interests: '',
      discipline_1: '',
      discipline_2: '',
      goals: [],
      un_goals: [],
      position: '',
      password: '',
      website: '',
      passwordConfirmation: '',
      collaboration: '',
      timezone: '',
      languages: [],
      communication: [],
      classes: [{
        id: 0,
        name: '',
        start: '',
        end: '',
      }],
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: '',
      photo: '',
      checked: false,
    };

    this.goalLimit = 3;
    this.formRef = React.createRef();

    // Context binding
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.addClass = this.addClass.bind(this);
    this.updateClass = this.updateClass.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.getUNGoals();
  }

  getUNGoals() {
    axios
      .get(`${API_URL}/goals`)
      .then((response) => {
        this.setState({ un_goals: response.data });
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value, type } = target;
    if (type === 'file') {
      this.setState({
        [name]: target.files.item(0),
      });
    } else if (name === 'languages' || name === 'communication') {
      this.toggleListItem(value, name);
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  toggleListItem(item, listName) {
    let list = this.state[listName];
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      if (listName === 'goals' && list.length === this.goalLimit) return;
      list.push(item);
    }
    this.setState({ [listName]: list });
  }

  handleSubmit(event) {
    event.preventDefault();

    const valid = this.validate();
    if (!valid) return null;

    this.setState({ alert: '' });

    const {
      firstName, lastName, email, bio, website, institution, discipline_1,
      discipline_2, interests, position, password, passwordConfirmation,
      collaboration, timezone, goals, classes, languages, instagram, photo,
      twitter, facebook, linkedin, communication,
    } = this.state;

    if (password !== passwordConfirmation) {
      // Handle password mismatch
      this.setState({
        alert: 'Your password and confirmation password do not match.',
      });
    } else {
      axios
        .post(`${API_URL}/auth/local/register`, {
          name: `${firstName} ${lastName}`,
          username: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          email,
          bio,
          website,
          institution,
          interests,
          discipline_1,
          discipline_2,
          position,
          password,
          collaboration,
          timezone,
          goals,
          classes,
          languages,
          communication,
          twitter,
          facebook,
          linkedin,
          instagram,
        })
        .then((response) => {
          localStorage.setItem('token', response.data.jwt);
          localStorage.setItem('id', response.data.user.id);
          return [response.data.user.id, response.data.jwt];
        })
        .then((credentials) => {
          if (photo) {
            const [refId, token] = credentials;
            const formData = new FormData();
            formData.append('files', photo);
            formData.append('ref', 'user');
            formData.append('refId', refId);
            formData.append('field', 'photo');
            formData.append('source', 'users-permissions');

            return axios({
              method: 'POST',
              url: `${API_URL}/upload`,
              headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data',
              },
              data: formData,
            });
          }
        })
        .then((res) => {
          this.props.history.push('/ideas?welcome');
        })
        .catch((error) => {
          console.log('An error occurred:', error);
          this.setState({ alert: 'This email address is already taken. Please try another' });
        });
    }
  }

  nextStep() {
    const valid = this.validate();
    if (valid) {
      const { currentStep, steps } = this.state;
      const nextStep = currentStep === steps ? 1 : currentStep + 1;
      this.setState({
        currentStep: nextStep,
        checked: false,
      });
    }
  }

  prevStep() {
    const { currentStep, steps } = this.state;
    const nextStep = currentStep === 1 ? steps : currentStep - 1;
    this.setState({ currentStep: nextStep });
  }

  validate() {
    const { currentStep, goals, communication } = this.state;
    let validity = false;

    if (currentStep === 2) {
      if (goals.length <= 3 && goals.length >= 1) {
        validity = true;
      }
    } else if (currentStep === 3) {
      if (communication.length >= 1) {
        validity = true;
      }
    } else {
      validity = this.formRef.current.checkValidity();
    }
    this.setState({ checked: true });
    return validity;
  }

  addClass() {
    const { classes } = this.state;
    const classIds = classes.map((klass) => klass.id);
    const nextId = classIds.reduce((a, b) => Math.max(a, b)) + 1;
    classes.push({
      id: nextId,
      name: '',
      start: '',
      end: '',
    });
    this.setState({ classes });
  }

  updateClass(entry, id) {
    const { classes } = this.state;
    const classIds = classes.map((klass) => klass.id);
    const index = classIds.indexOf(id);

    if (index >= 0) {
      classes[index] = entry;
      this.setState({ classes });
    } else {
      console.error('UpdateClass: Provided `id` not found in `classes`.');
    }
  }

  deleteClass(id) {
    const { classes } = this.state;
    const classIds = classes.map((klass) => klass.id);
    const index = classIds.indexOf(id);

    if (index >= 0 && index <= classes.length) {
      classes.splice(index, 1);
      this.setState({ classes });
    } else {
      console.error('DeleteClass: Provided `id` not found in `classes`.');
    }
  }

  render() {
    const {
      currentStep, steps, alert, firstName, lastName, email, bio, institution,
      interests, discipline_1, discipline_2, position, password, goals, website,
      passwordConfirmation, un_goals, collaboration, timezone, languages, photo,
      communication, classes, twitter, facebook, linkedin, instagram,
      validated, checked,
    } = this.state;

    const formClass = checked ? 'checked' : '';

    return (
      <Page>
        <section className="register">
          <form className={formClass} ref={this.formRef} onSubmit={this.handleSubmit}>

            <RegisterBasics
              currentStep={currentStep}
              handleChange={this.handleInputChange}
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              passwordConfirmation={passwordConfirmation}
              institution={institution}
              discipline_1={discipline_1}
              discipline_2={discipline_2}
              position={position}
              website={website}
            />

            <RegisterUNGoals
              currentStep={currentStep}
              goals={goals}
              unGoals={un_goals}
              handleChange={this.toggleListItem}
            />

            <RegisterDetails
              currentStep={currentStep}
              handleChange={this.handleInputChange}
              toggleListItem={this.toggleListItem}
              institution={institution}
              position={position}
              collaboration={collaboration}
              timezone={timezone}
              bio={bio}
              languages={languages}
              communication={communication}
              interests={interests}
              classes={classes}
              updateClass={this.updateClass}
              addClass={this.addClass}
              deleteClass={this.deleteClass}
              twitter={twitter}
              facebook={facebook}
              linkedin={linkedin}
              instagram={instagram}
              photo={photo}
            />

            <FormStepController
              currentStep={currentStep}
              steps={steps}
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              submitLabel="Create account!"
            />

            { alert && <div className="alert">{alert}</div> }
          </form>

        </section>
      </Page>
    );
  }
}

export default RegisterRoute;
