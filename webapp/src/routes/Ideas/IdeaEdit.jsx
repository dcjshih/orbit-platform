import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import validateWebsite from '../../helpers/validateWebsite';

import Page from '../../components/Page';
import Grid from '../../components/Grid';
import FormField from '../../components/FormField';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import ListTag from '../../components/ListTag';
import ToggleToken from '../../components/ToggleToken';
import Select from '../../components/Select';
import Alert from '../../components/Alert';

import communicationList from '../../data/communication.json';
import collaborationTypes from '../../data/collaborationTypes.json';

import './IdeaEdit.sass';

class IdeaEdit extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const { params } = this.props.match;

    this.state = {
      token,
      userId: id,
      ideaId: params.ideaId,
      title: '',
      description: '',
      institution: '',
      redirect: false,
      website: '',
      members: [],
      goals: [],
      un_goals: [],
      creator: '',
      duration: '',
      interests: '',
      communication: [],
      contact: '',
      collaboration: '',
    };

    this.goalLimit = 3;

    // Context binding
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.deleteIdea = this.deleteIdea.bind(this);
  }

  componentDidMount() {
    const { token, ideaId } = this.state;

    axios
      .get(`${API_URL}/ideas/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { data } = response;
        this.setState({
          title: data.title,
          description: data.description,
          website: data.website,
          members: data.members,
          institution: data.institution,
          creator: data.creator,
          goals: data.goals.map((goal) => goal.id),
          duration: data.duration,
          interests: data.interests,
          contact: data.contact,
          collaboration: '',
          communication: data.communication ? data.communication : [],
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
    const {
      token, ideaId, title, description, website, members, institution,
      goals, duration, interests, communication, contact, collaboration,
    } = this.state;
    axios({
      method: 'put',
      url: `${API_URL}/ideas/${ideaId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title,
        description,
        website,
        members,
        institution,
        goals,
        duration,
        interests,
        contact,
        communication,
        collaboration,
      },

    })
      .then((response) => {
        this.setState({ redirect: `/ideas/${ideaId}` });
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

  removeMember(memberId) {
    const { members } = this.state;
    const removeIndex = members.map((member) => member.id).indexOf(memberId);
    if (removeIndex >= 0) {
      members.splice(removeIndex, 1);
      this.setState({ members });
    }
  }

  toggleListItem(item, listName) {
    const list = this.state[listName];
    const index = list.indexOf(item);
    if (index >= 0) {
      if ((listName === 'goals' && list.length > 1)
        || (listName === 'communication')) {
        list.splice(index, 1);
      }
    } else {
      if (listName === 'goals' && list.length === this.goalLimit) return;
      list.push(item);
    }
    this.setState({ [listName]: list });
  }

  deleteIdea(event) {
    event.preventDefault();
    const { ideaId, userId, creator, token } = this.state;
    if (userId === creator) {
      axios({
        method: 'DELETE',
        url: `${API_URL}/ideas/${ideaId}`,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          this.setState({ redirect: '/ideas' });
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
  }

  render() {
    const userId = localStorage.getItem('id');
    const {
      title, description, ideaId, redirect, website, members,
      institution, goals, un_goals, duration, interests, contact,
      creator, communication, collaboration,
    } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    const membersList = [];
    members.forEach((member) => {
      const isSelf = member.id === userId;
      const isCreator = member.id === creator;
      if (isSelf || isCreator) {
        membersList.push(
          <ListTag
            key={member.id}
            id={member.id}
            type="people"
            label={member.name}
            descriptor={isCreator ? 'Creator' : ''}
          />,
        );
      } else {
        membersList.push(
          <ListTag
            key={member.id}
            id={member.id}
            type="people"
            label={member.name}
            remove={() => this.removeMember(member.id)}
          />,
        );
      }
    });

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

    // Communication
    const communicationOptions = communicationList.map((type) => ({
      id: type,
      label: type,
    }));

    const validWebsite = validateWebsite(website);

    return (
      <Page>
        <form className="idea-edit" onSubmit={this.handleSubmit}>
          <header>
            <h1>Edit idea</h1>
          </header>

          <Grid>
            <h2 className="main">Basics</h2>
            <div className="content-area">
              <FormField label="Title:" required>
                <TextInput
                  name="title"
                  value={title}
                  onChange={this.handleInputChange}
                />
              </FormField>
            </div>
            <div className="content-area">
              <FormField label="Description:" required>
                <TextArea
                  name="description"
                  value={description}
                  onChange={this.handleInputChange}
                />
              </FormField>
            </div>
            <div className="col-1">
              <FormField label="Institution:" required>
                <TextInput
                  name="institution"
                  value={institution}
                  onChange={this.handleInputChange}
                />
              </FormField>
            </div>
            <div className="col-2">
              <FormField label="Website:">
                <TextInput
                  name="website"
                  value={website}
                  onChange={this.handleInputChange}
                />
              </FormField>
            </div>
            { !validWebsite && <Alert klass="content-area" label="Website must begin with 'http'" /> }

            <FormField label="Contact email" className="col-1" required>
              <TextInput
                name="contact"
                value={contact}
                onChange={this.handleInputChange}
                placeholder="account@domain.com"
              />
            </FormField>
            <FormField
              label="Desired collaboration type:"
              className="col-2"
              required
            >
              <Select
                name="collaboration"
                value={collaboration}
                onChange={this.handleInputChange}
                options={collaborationTypes}
              />
            </FormField>

            <FormField label="Duration:" className="content-area" required>
              <TextInput
                name="duration"
                value={duration}
                onChange={this.handleInputChange}
                placeholder="E.g., 2 weeks, 4 months, undetermined"
              />
            </FormField>

            <FormField
              label="Please add up to 5 keywords that describe your idea; use a semicolon (;) between each item."
              className="content-area"
            >
              <TextInput
                name="interests"
                value={interests}
                onChange={this.handleInputChange}
                placeholder="Separate by semicolon (;)"
              />
            </FormField>
          </Grid>

          { (membersList.length > 0) && (
            <Grid>
              <h2>Collaborators</h2>
              <div className="content-area">
                <ul className="members-list">
                  {membersList}
                </ul>
              </div>
            </Grid>
          )}

          { (officialList && unofficialList) && (
            <Grid>
              <h2>Collaboration goals</h2>
              <div className="full-width">
                <div className="goals-list">
                  { officialList }
                  <p className="separator">Additional goals (Non-UN):</p>
                  { unofficialList }
                </div>
              </div>
            </Grid>
          )}

          <Grid>
            <h2>Communication preferences</h2>
            <FormField
              label="What methods of communication or platforms do you prefer to use for this project?"
              className="content-area"
              required
            >
              <Select
                name="communication"
                placeholder="Select all that apply"
                value={communication}
                onChange={this.handleInputChange}
                options={communicationOptions}
                multiple="true"
              />
            </FormField>
          </Grid>

          <Grid>
            <div className="danger-zone content-area">
              <h2>Danger zone</h2>
              <Button
                label="Delete idea"
                type="button"
                className="idea-delete"
                onClick={this.deleteIdea}
              />
              <p>Once you delete an Idea, there is no going back. Please be certain.</p>
            </div>
          </Grid>

          <div className="button-group">
            <Link className="button secondary" to={`/ideas/${ideaId}`}>Cancel</Link>
            <Button label="Save" className="primary" />
          </div>
        </form>
      </Page>
    );
  }
}

export default IdeaEdit;
