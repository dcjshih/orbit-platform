import React, { Component } from 'react';
import axios from 'axios';

import Page from '../../components/Page';
import ListTag from '../../components/ListTag';
import Toolbar from '../../components/Toolbar';
import Button from '../../components/Button';
import Grid from '../../components/Grid';

import collaborationTypes from '../../data/collaborationTypes.json';

import './Idea.sass';

function parseBookmarks(bookmarks) {
  let parsed = bookmarks;
  if (bookmarks.length > 0) {
    if (typeof bookmarks[0] !== 'string') {
      parsed = bookmarks.map((el) => el.id);
    }
  }
  return parsed;
}

function parseDate(dateString) {
  const date = new Date(dateString);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);

  return `${day} ${month} ${year}`;
}

class Idea extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const { params } = this.props.match;

    this.state = {
      token,
      idea: false,
      user: false,
      userId: '',
      ideaId: params.ideaId,
      title: '',
      description: '',
      institution: '',
      interests: '',
      createdAt: 0,
      creator: '',
      updatedAt: 0,
      members: [],
      website: '',
      applications: [],
      candidates: [],
      communication: [],
      goals: [],
      duration: '',
      contact: '',
      collaboration: '',
    };

    // Bindings
    this.toggleApplication = this.toggleApplication.bind(this);
    this.removeCandidate = this.removeCandidate.bind(this);
    this.addMember = this.addMember.bind(this);
    this.leaveIdea = this.leaveIdea.bind(this);
  }

  componentDidMount() {
    const { token, ideaId } = this.state;

    // Pull in bookmarks and pending applications from user
    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { data } = response;
        this.setState({
          user: data,
          userId: data.id,
          applications: parseBookmarks(data.applications),
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

    // Get idea data
    axios
      .get(`${API_URL}/ideas/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { data } = response;
        this.setState({
          idea: data,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          creator: data.creator,
          members: data.members,
          institution: data.institution,
          candidates: data.candidates,
          website: data.website,
          goals: data.goals,
          duration: data.duration,
          interests: data.interests,
          communication: data.communication,
          contact: data.contact,
          collaboration: data.collaboration,
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
  }

  toggleApplication() {
    const {
      applications, userId, ideaId, token,
    } = this.state;
    let updatedApplications = applications;

    if (applications.filter((id) => id === ideaId).length > 0) {
      updatedApplications = applications.filter((id) => id !== ideaId);
    } else {
      updatedApplications.push(ideaId);
    }

    axios({
      method: 'put',
      url: `${API_URL}/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: { applications: updatedApplications },
    })
      .then((response) => {
        this.setState({ applications: updatedApplications });
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

  updateIdea() {
    const { members, candidates, ideaId, token } = this.state;

    axios({
      method: 'put',
      url: `${API_URL}/ideas/${ideaId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: { members, candidates },
    })
      .then((response) => {
        this.setState({
          candidates: response.data.candidates,
          members: response.data.members,
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
  }

  removeCandidate(candidateId) {
    const { candidates } = this.state;
    const removeIndex = candidates.map((member) => member.id).indexOf(candidateId);
    let candidate = false;
    if (removeIndex >= 0) {
      candidate = candidates.splice(removeIndex, 1);
      this.setState({ candidates });
      this.updateIdea();
    }
    return candidate;
  }

  addMember(candidateId) {
    const { members } = this.state;
    const candidate = this.removeCandidate(candidateId);
    members.push(...candidate);
    this.setState({ members });
    this.updateIdea();
  }

  leaveIdea(id) {
    const { userId, members, creator } = this.state;

    if (userId !== creator) {
      const removeIndex = members.map((member) => member.id).indexOf(id);
      if (removeIndex >= 0) {
        members.splice(removeIndex, 1);
        this.setState({ members });
        this.updateIdea();
      }
    }
  }

  render() {
    const {
      userId, title, description, applications, interests, communication,
      candidates, institution, ideaId, creator, user, idea, collaboration,
      createdAt, updatedAt, members, website, goals, duration,
    } = this.state;

    // Construct list the Idea's collaborators
    const memberList = [];
    members.forEach((member) => {
      const descriptor = creator === member.id ? 'Creator' : '';
      memberList.push(
        <ListTag
          key={member.id}
          id={member.id}
          type="people"
          descriptor={descriptor}
          label={member.name}
        />,
      );
    });

    // Construct list the Idea's candidate collaborators
    const candidateList = [];
    candidates.forEach((candidate) => {
      candidateList.push(
        <ListTag
          key={candidate.id}
          id={candidate.id}
          type="people"
          label={candidate.name}
          add={() => this.addMember(candidate.id)}
          remove={() => this.removeCandidate(candidate.id)}
        />,
      );
    });

    const interestsList = [];
    if (interests) {
      const tags = interests.split(';');
      if (tags.length > 0) {
        tags.forEach((tag) => {
          if (tag.length) {
            interestsList.push(
              <li key={tag}>
                {tag.trim()}
              </li>,
            );
          }
        });
      }
    }

    // Get pretty label for collaboration
    let collaborationLabel = 'Loading';
    const collaborationIndex = collaborationTypes.map((type) => type.id).indexOf(collaboration);
    if (collaborationIndex >= 0) {
      collaborationLabel = collaborationTypes[collaborationIndex].label;
    }

    // Conditional rendering flags
    const isMember = members.filter((member) => member.id === userId).length > 0;
    const appliedTo = !applications.includes(ideaId) ? 'Ask to join idea' : 'Withdraw application';

    return (
      <Page>
        <header>
          <h1>{title}</h1>
          <Toolbar
            idea={idea}
            me={user}
            leaveIdea={() => this.leaveIdea(userId)}
          />
        </header>

        <Grid>
          <section className="grid-area-main">
            <div className="metadata">
              <h3>Description</h3>
              <p>{description}</p>
            </div>

            { website && (
              <div className="metadata">
                <h3>Website</h3>
                <a href={website} target="_blank" rel="noreferrer">{website}</a>
              </div>
            )}

            <div className="metadata">
              <h3>Institution</h3>
              <p>{institution}</p>
            </div>

            { goals.length > 0 && (
              <div className="metadata">
                <h3>Collaboration Goals</h3>
                <ul className="person-goals">
                  { goals.map((goal) => <li key={goal.id}>{goal.label}</li>) }
                </ul>
              </div>
            )}

            { collaboration && (
              <div className="metadata">
                <h3>Desired Collaboration Type</h3>
                <p>{collaborationLabel}</p>
              </div>
            )}

            <div className="metadata">
              <h3>Duration</h3>
              <p>{duration}</p>
            </div>

            { communication && communication.length > 0 && (
              <div className="metadata">
                <h3>Communication Preferences</h3>
                <ul className="communicationPlatforms">
                  {communication.map((type) => <li key={type}>{type}</li>)}
                </ul>
              </div>
            )}

            { interestsList.length > 0 && (
              <div className="metadata">
                <h3>Interest Tags</h3>
                <ul className="interest-tags">
                  { interestsList }
                </ul>
              </div>
            )}

            <div className="metadata">
              <h3>Created</h3>
              <p>{parseDate(createdAt)}</p>
            </div>

            <div className="metadata">
              <h3>Updated</h3>
              <p>{parseDate(updatedAt)}</p>
            </div>

          </section>

          <section className="grid-area-sidebar">
            { candidateList.length > 0 && isMember && (
              <div className="metadata">
                <h3>Pending collaborators:</h3>
                <ul className="idea-candidates">
                  {candidateList}
                </ul>
              </div>
            )}

            <div className="metadata">
              <h3>Collaborators</h3>
              <ul className="idea-collaborators">
                {memberList}
              </ul>
            </div>

            { !isMember && appliedTo && (
              <p>Have you talked to the idea creator using the contact link above? If so:</p>
            )}

            { !isMember && (
              <Button
                type="button"
                className="application-toggle"
                onClick={this.toggleApplication}
                label={appliedTo}
              />
            )}
          </section>
        </Grid>
      </Page>
    );
  }
}

export default Idea;
