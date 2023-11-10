import React, { Component } from 'react';
import axios from 'axios';

import Page from '../../components/Page';
import CreateIdeaFormBasics from '../../components/CreateIdeaFormBasics';
import CreateIdeaFormUNGoals from '../../components/CreateIdeaFormUNGoals';
import FormStepController from '../../components/FormStepController';

import './IdeaNew.sass';

class IdeaNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      steps: 2,
      redirect: false,
      title: '',
      website: '',
      description: '',
      institution: '',
      interests: '',
      duration: '',
      collaboration: '',
      communication: [],
      goals: [],
      un_goals: [],
      contact: '',
      checked: false,
    };

    this.goalLimit = 3;
    this.formRef = React.createRef();

    // Context bindings
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          institution: response.data.institution,
          contact: response.data.email,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        } else {
          console.error('An error occurred: ', error);
        }
      });

    // Get UN Goals
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
    const { name, value } = target;
    if (name === 'communication' || name === 'goals') {
      this.toggleListItem(value, name);
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const valid = this.validate();
    if (!valid) return null;

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const {
      title, description, website, institution, contact,
      interests, duration, goals, communication, collaboration,
    } = this.state;

    axios({
      method: 'POST',
      url: `${API_URL}/ideas`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title,
        description,
        website,
        goals,
        contact,
        institution,
        interests,
        duration,
        communication,
        collaboration,
        creator: id,
        members: [id],
      },
    })
      .then((response) => {
        this.props.history.push(`/ideas/${response.data.id}`);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        } else {
          console.error('An error occurred: ', error);
        }
      });
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
    const { currentStep, goals } = this.state;
    let validity = false;

    if (currentStep === 2) {
      if (goals.length <= 3 && goals.length >= 1) {
        validity = true;
      }
    } else {
      validity = this.formRef.current.checkValidity();
    }
    this.setState({ checked: true });
    return validity;
  }

  toggleListItem(item, listName) {
    let list = this.state[listName];
    const index = list.indexOf(item);
    if (index >= 0) {
      if (list.length > 1) {
        list.splice(index, 1);
      }
    } else {
      if (listName === 'goals' && list.length === this.goalLimit) return;
      list.push(item);
    }
    this.setState({ [listName]: list });
  }

  render() {
    const {
      currentStep, steps, title, description, checked, collaboration,
      website, goals, un_goals, duration, interests, communication,
    } = this.state;

    const formClass = checked ? 'checked' : '';

    return (
      <Page>
        <main className="ideas-new">
          <form className={formClass} ref={this.formRef} onSubmit={this.handleSubmit}>

            <CreateIdeaFormBasics
              currentStep={currentStep}
              handleChange={this.handleInputChange}
              title={title}
              website={website}
              duration={duration}
              description={description}
              interests={interests}
              communication={communication}
              collaboration={collaboration}
            />

            <CreateIdeaFormUNGoals
              currentStep={currentStep}
              goals={goals}
              unGoals={un_goals}
              toggleListItem={this.toggleListItem}
            />

            <FormStepController
              currentStep={currentStep}
              steps={steps}
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              submitLabel="Create idea!"
            />
          </form>
        </main>
      </Page>
    );
  }
}

export default IdeaNew;
