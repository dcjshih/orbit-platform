import React, { Component } from 'react';
import axios from 'axios';

import Page from '../../components/Page';
import Grid from '../../components/Grid';
import ListTag from '../../components/ListTag';
import Toolbar from '../../components/Toolbar';

import collaborationTypes from '../../data/collaborationTypes.json';
import timezones from '../../data/timezones.json';

import './Person.sass';

class Person extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const { params } = this.props.match;

    this.state = {
      token,
      person: false,
      id: params.personId || 'me',
      name: '',
      email: '',
      institution: '',
      interests: '',
      position: '',
      bio: '',
      website: '',
      ideas: [],
      goals: [],
      collaboration: '',
      timezone: 'none',
      languages: [],
      discipline_1: 'none',
      discipline_2: 'none',
      communication: [],
      modalReport: false,
      classes: [],
      profilePhoto: false,
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: '',
    };
  }

  componentDidMount() {
    const { id, token } = this.state;

    axios
      .get(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { data } = response;
        this.setState({
          person: data,
          name: data.name,
          email: data.email,
          institution: data.institution,
          position: data.position,
          interests: data.interests,
          bio: data.bio,
          website: data.website,
          goals: data.goals,
          collaboration: data.collaboration,
          timezone: data.timezone,
          discipline_1: data.discipline_1,
          discipline_2: data.discipline_2,
          communication: data.communication,
          languages: data.languages,
          classes: data.classes,
          profilePhoto: data.photo,
          twitter: data.twitter,
          facebook: data.facebook,
          linkedin: data.linkedin,
          instagram: data.instagram,
          ideas: data.ideas,
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

  render() {
    const {
      person,
      name,
      email,
      institution,
      position,
      interests,
      bio,
      website,
      ideas,
      goals,
      collaboration,
      timezone,
      languages,
      communication,
      discipline_1,
      discipline_2,
      modalReport,
      classes,
      profilePhoto,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = this.state;

    const ideaList = [];
    ideas.forEach((idea) => {
      ideaList.push(
        <ListTag
          key={idea.id}
          id={idea.id}
          type="ideas"
          label={idea.title}
          descriptor={idea.creator ? 'Creator' : ''}
        />,
      );
    });

    // Collect disciplines
    const disciplines = [];
    if (discipline_1 !== 'none') disciplines.push(discipline_1);
    if (discipline_2 !== 'none') disciplines.push(discipline_2);

    // Get pretty label for collaboration
    let collaborationLabel = 'Loading';
    const collaborationIndex = collaborationTypes.map((type) => type.id).indexOf(collaboration);
    if (collaborationIndex >= 0) {
      collaborationLabel = collaborationTypes[collaborationIndex].label;
    }

    // Get pretty label for timezone
    let timezoneLabel = 'Loading';
    const timezoneIndex = timezones.map((zone) => zone.name).indexOf(timezone);
    if (timezoneIndex >= 0) {
      const { name, description } = timezones[timezoneIndex];
      timezoneLabel = `${description} (${name})`;
    }

    // Compile list of Idea interests
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

    // Compile list of classes
    const classList = [];
    if (classes) {
      classes.forEach((entry) => {
        const entityName = `${entry.name} `;
        const entityRange = `(${entry.start}–${entry.end})`;
        if (entry.name) {
          classList.push(
            <li key={Math.random().toString()}>
              <p>
                {entityName}
                <span className="faded">
                  {entityRange}
                </span>
              </p>
            </li>,
          );
        }
      });
    }

    const renderClasses = (classes && classes.length >= 1 && classes[0].name !== '');

    // List of social media profiles
    const socialMedia = [];
    if (twitter && twitter.length > 0) {
      socialMedia.push(
        <li key="twitter">
          <a href={twitter} target="_blank" rel="noreferrer">Twitter</a>
        </li>,
      );
    }
    if (facebook && facebook.length > 0) {
      socialMedia.push(
        <li key="facebook">
          <a href={facebook} target="_blank" rel="noreferrer">Facebook</a>
        </li>,
      );
    }
    if (linkedin && linkedin.length > 0) {
      socialMedia.push(
        <li key="linkedin">
          <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </li>,
      );
    }
    if (instagram && instagram.length > 0) {
      socialMedia.push(
        <li key="instagram">
          <a href={instagram} target="_blank" rel="noreferrer">Instagram</a>
        </li>,
      );
    }

    // Profile image
    const defaultImage = 'none';
    let image = defaultImage;
    if (person.photo) {
      image = `url(${API_URL}${person.photo[0]})`;
    }

    return (
      <Page>
        <Grid className="profile">
          <header>
            <div className="profile-avatar">
              <div
                className="profile-photo"
                style={{ backgroundImage: image }}
              />
              <div className="profile-description">
                <h1>{name}</h1>
                <p>{`${position} at ${institution}`}</p>
              </div>
            </div>
            <Toolbar person={person} />
          </header>

          <section className="grid-area-main">
            <div className="metadata">
              <h3>Bio</h3>
              <p>{bio}</p>
            </div>

            { goals.length > 0 && (
              <div className="metadata">
                <h3>Collaboration Goals</h3>
                <ul className="person-goals">
                  { goals.map((goal) => <li key={goal.id}>{goal.label}</li>) }
                </ul>
              </div>
            )}

            { interests.length > 0 && (
              <div className="metadata">
                <h3>Interest Tags</h3>
                <ul className="languages">
                  {interestsList}
                </ul>
              </div>
            )}

            { languages && languages.length > 0 && (
              <div className="metadata">
                <h3>Preferred {languages.length === 1 ? 'Language' : 'Languages'}</h3>
                <ul className="languages">
                  {languages.map((language) => <li key={language}>{language}</li>)}
                </ul>
              </div>
            )}

            { communication && (
              <div className="metadata">
                <h3>Communication Preferences</h3>
                <ul className="communicationMethods">
                  {communication.map((type) => <li key={type}>{type}</li>)}
                </ul>
              </div>
            )}

            <div className="metadata">
              <h3>{disciplines.length === 1 ? 'Discipline' : 'Disciplines'}</h3>
              <ul className="disciplines">
                {disciplines.map((discipline) => discipline && <li key={discipline}>{discipline}</li>)}
              </ul>
            </div>

            <div className="metadata">
              <h3>Desired Collaboration Type</h3>
              <p>{collaborationLabel}</p>
            </div>

            <div className="metadata">
              <h3>Time Zone</h3>
              <p>{timezoneLabel}</p>
            </div>

            { website.length > 0 && (
              <div className="metadata">
                <h3>Website</h3>
                <a href={website} target="_blank" rel="noreferrer">{website}</a>
              </div>
            )}

            { socialMedia && socialMedia.lenght > 0 && (
              <div className="metadata">
                <h3>Social Media</h3>
                <ul className="social-media">
                  {socialMedia}
                </ul>
              </div>
            )}

            { renderClasses && (
              <div className="metadata">
                <h3>{classes.length === 1 ? 'Course' : 'Courses'}</h3>
                <ul className="classes">
                  {classList}
                </ul>
              </div>
            )}

          </section>

          <section className="grid-area-sidebar">
            { ideas.length > 0 && (
            <div className="metadata">
              <h3>Ideas</h3>
              <ul className="person-ideas">
                {ideaList}
              </ul>
            </div>
            )}
          </section>

        </Grid>
      </Page>
    );
  }
}

export default Person;
