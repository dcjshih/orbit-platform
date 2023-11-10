import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import validateWebsite from '../../helpers/validateWebsite';

// Components
import Page from '../../components/Page';
import Grid from '../../components/Grid';
import FormField from '../../components/FormField';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import SelectGroup from '../../components/SelectGroup';
import Button from '../../components/Button';
import ToggleToken from '../../components/ToggleToken';
import ClassComposer from '../../components/ClassComposer';
import AvatarEdit from '../../components/AvatarEdit';
import Alert from '../../components/Alert';

// Load data
import collaborationTypes from '../../data/collaborationTypes.json';
import communicationList from '../../data/communication.json';
import timezones from '../../data/timezones.json';
import languageList from '../../data/languages.json';
import disciplines from '../../data/disciplines.json';

import './PersonEdit.sass';


class PersonEdit extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    this.state = {
      token,
      id,
      first_name: '',
      last_name: '',
      institution: '',
      position: '',
      interests: '',
      bio: '',
      website: '',
      goals: [],
      un_goals: [],
      redirect: false,
      collaboration: '',
      communication: [],
      timezone: '',
      languages: [],
      discipline_1: '',
      discipline_2: '',
      classes: [],
      user: false,
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: '',
    };

    this.goalLimit = 3;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.addClass = this.addClass.bind(this);
    this.updateClass = this.updateClass.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.handleImageInputChange = this.handleImageInputChange.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  componentDidMount() {
    const { token, id } = this.state;

    axios
      .get(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { data } = response;
        this.setState({
          user: data,
          first_name: data.first_name,
          last_name: data.last_name,
          institution: data.institution,
          position: data.position,
          interests: data.interests,
          bio: data.bio,
          goals: data.goals.map((goal) => goal.id),
          website: data.website,
          collaboration: data.collaboration,
          timezone: data.timezone,
          discipline_1: data.discipline_1,
          discipline_2: data.discipline_2,
          languages: data.languages,
          communication: data.communication ? data.communication : [],
          classes: data.classes ? data.classes : [],
          twitter: data.twitter,
          facebook: data.facebook,
          linkedin: data.linkedin,
          instagram: data.instagram,
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

    // Get list of UN goals
    axios
      .get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({ un_goals: response.data });
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { token } = this.state;
    const {
      id,
      first_name,
      last_name,
      institution,
      position,
      interests,
      bio,
      goals,
      website,
      collaboration,
      timezone,
      languages,
      communication,
      discipline_1,
      discipline_2,
      classes,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = this.state;

    const full_name = `${first_name} ${last_name}`;
    axios({
      method: 'put',
      url: `${API_URL}/users/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        first_name,
        last_name,
        name: full_name,
        username: full_name,
        institution,
        position,
        interests,
        bio,
        goals,
        website,
        collaboration,
        timezone,
        discipline_1,
        discipline_2,
        communication,
        languages,
        classes,
        twitter,
        facebook,
        linkedin,
        instagram,
      },
    })
      .then((response) => {
        this.setState({ redirect: true });
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

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    if (name === 'languages' || name === 'communication') {
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
      if (list.length > 1) {
        list.splice(index, 1);
      }
    } else {
      if (listName === 'goals' && list.length === this.goalLimit) return;
      list.push(item);
    }
    this.setState({ [listName]: list });
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

  handleImageInputChange(event) {
    const { target } = event;
    const { files } = target;

    if (files.length === 0) {
      this.setState({ photo: false });
    } else {
      this.setState({ photo: files.item(0) });
    }
  }

  deleteProfile(event) {
    event.preventDefault();
    const { id, token } = this.state;

    axios({
      method: 'DELETE',
      url: `${API_URL}/users/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        localStorage.clear();
        this.props.history.push('/');
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

  render() {
    const {
      first_name,
      last_name,
      institution,
      position,
      interests,
      bio,
      goals,
      un_goals,
      website,
      collaboration,
      timezone,
      languages,
      discipline_1,
      discipline_2,
      communication,
      classes,
      user,
      twitter,
      facebook,
      linkedin,
      instagram,
      redirect,
      id,
    } = this.state;

    if (redirect === true) {
      return <Redirect to={`/people/${id}`} />;
    }

    const officialList = [];
    const unofficialList = [];
    un_goals.forEach((goal) => {
      const enabled = goals.includes(goal.id);

      const element = (
        <ToggleToken
          key={goal.id}
          label={goal.label}
          enabled={enabled}
          toggle={() => this.toggleListItem(goal.id, 'goals')}
        />
      );

      if (goal.official) {
        officialList.push(element);
      } else {
        unofficialList.push(element);
      }
    });

    const timezoneOptions = timezones.map((zone) => ({
      id: zone.name,
      label: `${zone.description} (${zone.name})`,
    }));

    const languageOptions = [];
    languageList.forEach((type) => {
      languageOptions.push({
        id: type,
        label: type,
      });
    });

    // Communication methods
    const communicationOptions = communicationList.map((type) => ({
      id: type,
      label: type,
    }));

    const validWebsite = validateWebsite(website);


    return (
      <Page>
        <Grid>
          <header>
            <h1>Edit profile</h1>
          </header>

          <AvatarEdit person={user} />
          <p className="content-area" style={{ marginTop: '16px' }}>Add some more personality to your profile with an optional profile image. It doesn’t need to be photographic. (.PNG, .JPG, less than 1MB)</p>
        </Grid>

        <form className="person-edit" onSubmit={this.handleSubmit}>
          <Grid>

            <h2 className="content-area">Introduction</h2>
            <FormField
              label="Given name:"
              className="col-1"
              required
            >
              <TextInput
                type="text"
                name="first_name"
                value={first_name}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField
              label="Family name:"
              className="col-2"
              required
            >
              <TextInput
                type="text"
                name="last_name"
                value={last_name}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField
              label="Institution:"
              className="col-1"
              required
            >
              <TextInput
                type="text"
                name="institution"
                value={institution}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField
              label="Position:"
              className="col-2"
              required
            >
              <TextInput
                type="text"
                name="position"
                value={position}
                onChange={this.handleInputChange}
              />
            </FormField>

            <FormField
              label="Discipline:"
              className="col-1"
              required
            >
              <SelectGroup
                name="discipline_1"
                value={discipline_1}
                onChange={this.handleInputChange}
                data={disciplines}
                placeholder="None"
              />
            </FormField>

            <FormField
              label="Add a second discipline:"
              className="col-2"
            >
              <SelectGroup
                name="discipline_2"
                value={discipline_2}
                onChange={this.handleInputChange}
                data={disciplines}
                placeholder="None"
              />
            </FormField>

            <FormField
              label="Website: (Please copy and paste the full URL including https:// )"
              className="content-area"
            >
              <TextInput
                type="text"
                name="website"
                value={website}
                onChange={this.handleInputChange}
              />
            </FormField>

            { !validWebsite && <Alert klass="content-area" label="Website must begin with 'http'" /> }

            <FormField
              label="Please add at least 3 keywords that generally describe your teaching or research interests. (Use a semicolon (;) between each item.)"
              className="content-area"
            >
              <TextInput
                type="text"
                name="interests"
                value={interests}
                onChange={this.handleInputChange}
                placeholder="Separate by semicolon (;)"
              />
            </FormField>

            <FormField
              label="Desired collaboration type:"
              className="col-1"
              required
            >
              <Select
                name="collaboration"
                value={collaboration}
                onChange={this.handleInputChange}
                options={collaborationTypes}
              />
            </FormField>

            <FormField
              label="Please select your timezone:"
              className="col-2"
              required
            >
              <Select
                name="timezone"
                value={timezone}
                onChange={this.handleInputChange}
                options={timezoneOptions}
              />
            </FormField>

            <FormField
              label="What language or languages do you feel comfortable communicating in? (Please select all that apply)."
              className="content-area"
            >
              <Select
                name="languages"
                placeholder="Select one or more"
                value={languages}
                onChange={this.handleInputChange}
                options={languageOptions}
                multiple="true"
              />
            </FormField>

            <FormField
              label="Bio:"
              className="content-area"
              required
            >
              <TextArea
                name="bio"
                value={bio}
                onChange={this.handleInputChange}
              />
            </FormField>
          </Grid>

          <div className="goals-list">
            <Grid>
              <h2>Collaboration goals</h2>
              <div className="content-area">
                <p>
                  <span>Please select 1–3 of the goals on this page that best align with your teaching and research interests. You can also suggest more goals using </span>
                  <a href="https://forms.gle/uABCHNbUQ9fpxTcd8" target="_blank" rel="noreferrer">this form</a>
                  <span>.</span>
                </p>
                <p>People who have goals in common with yours will appear at the top of your ‘Explore People’ page.</p>
                <p>The number of goals you have in common will be indicated by black bullet points in the bottom right corner of a person’s card.</p>
              </div>
              <h3 className="content-area">UN Sustainable Development goals</h3>
              <p className="content-area">
                <span>This list is based upon the </span>
                <a href="https://unfoundation.org/what-we-do/issues/sustainable-development-goals/?gclid=Cj0KCQjwpNr4BRDYARIsAADIx9xhejCGbnEafRjtUxyBFjfU84jphiZp74NBygvwpZ9BB3Enz2MIo7UaAo9OEALw_wcB" target="_blank" rel="noreferrer">United Nations’ Sustainable Development Goals</a>
                <span>, which they created to unify the way people around the world think about change.</span>
              </p>
            </Grid>
            { officialList }

            <h3 className="content-area">Additional Goals (Non-UN):</h3>
            { unofficialList }
          </div>

          <Grid>
            <h2 className="content-area">Social media</h2>
            <p className="content-area">(Please copy and paste the full URL including https:// )</p>
            <br />
            <br />

            <FormField
              label="Twitter:"
              className="col-1"
            >
              <TextInput
                type="text"
                name="twitter"
                value={twitter}
                onChange={this.handleInputChange}
              />
            </FormField>
            <FormField
              label="Facebook:"
              className="col-2"
            >
              <TextInput
                type="text"
                name="facebook"
                value={facebook}
                onChange={this.handleInputChange}
              />
            </FormField>
            <FormField
              label="LinkedIn:"
              className="col-1"
            >
              <TextInput
                type="text"
                name="linkedin"
                value={linkedin}
                onChange={this.handleInputChange}
              />
            </FormField>
            <FormField
              label="Instagram:"
              className="col-2"
            >
              <TextInput
                type="text"
                name="instagram"
                value={instagram}
                onChange={this.handleInputChange}
              />
            </FormField>
          </Grid>

          <Grid>
            <h2 className="content-area">Communication preferences</h2>
            <FormField
              label="What are your preferred modes of communication for working with future collaborators?"
              className="content-area"
              required
            >
              <Select
                name="communication"
                placeholder="Select one or more"
                value={communication}
                onChange={this.handleInputChange}
                options={communicationOptions}
                multiple="true"
              />
            </FormField>
          </Grid>

          <Grid>
            <h2 className="content-area">Courses</h2>
            <p className="content-area">For teaching collaborations, please indicate the name, start, and end dates of course(s) for which you’d like to organize a collaboration or virtual exchange.</p>
            <ClassComposer
              classes={classes}
              updateClass={this.updateClass}
              addClass={this.addClass}
              deleteClass={this.deleteClass}
            />
          </Grid>

          <Grid>
            <div className="danger-zone content-area">
              <h3 className="content-area">Danger zone</h3>
              <Button
                label="Delete profile"
                type="button"
                className="idea-delete"
                onClick={this.deleteProfile}
              />
              <p>Once you delete a Profile, there is no going back. Please be certain. Deleting a profile also deletes all Ideas created by it.</p>
            </div>
          </Grid>

          <div className="button-group">
            <Link className="button secondary" to="/people/me">Cancel</Link>
            <Button label="Save" className="primary" />
          </div>

        </form>
      </Page>
    );
  }
}

export default PersonEdit;
