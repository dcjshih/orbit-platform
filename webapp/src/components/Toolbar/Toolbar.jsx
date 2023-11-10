import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Icon from '../Icon';
import ModalReport from '../ModalReport';

import './Toolbar.sass';

class Toolbar extends Component {
  constructor() {
    super();

    this.state = {
      updatedBookmarks: false,
      bookmarkCountDelta: 0,
      modalReport: false,
      moreMenu: false,
    };

    // Context bindings
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleBookmark = this.toggleBookmark.bind(this);
  }

  toggleBookmark() {
    const { updatedBookmarks, bookmarkCountDelta } = this.state;
    const token = localStorage.getItem('token');
    const { idea, me } = this.props;

    let delta;
    const bookmarks = updatedBookmarks !== false ? updatedBookmarks : me.bookmarked_ideas;
    if (bookmarks.includes(idea.id)) {
      const removeIndex = bookmarks.indexOf(idea.id);
      bookmarks.splice(removeIndex, 1);
      delta = bookmarkCountDelta === 1 ? 0 : -1;
    } else {
      bookmarks.push(idea.id);
      delta = bookmarkCountDelta === -1 ? 0 : 1;
    }

    axios({
      method: 'PUT',
      url: `${API_URL}/users/${me.id}`,
      headers: { Authorization: `Bearer ${token}` },
      data: { bookmarked_ideas: bookmarks },
    })
      .then((response) => {
        this.setState({
          updatedBookmarks: bookmarks,
          bookmarkCountDelta: delta,
        });
      })
      .catch((error) => {
        console.error('An error occurred: ', error);
      });
  }

  openModal(modal) {
    this.setState({ [modal]: true });
  }

  closeModal(modal) {
    this.setState({ [modal]: false });
  }

  toggleDropdown(name) {
    if (this.state[name]) {
      this.setState({ [name]: false });
      document.removeEventListener('click', this.closeDropdowns);
    } else {
      this.setState({ [name]: true });
      document.addEventListener('click', this.closeDropdowns);
    }
  }

  render() {
    const { idea, person, me, leaveIdea } = this.props;

    // Return null while data is unavailable
    if (!((idea && me) || person)) return null;
    const { moreMenu, modalReport, updatedBookmarks, bookmarkCountDelta } = this.state;

    // Conditional rendering flags
    let isMember;
    let bookmarks;
    let isBookmarked;
    let viewingIdea;
    let viewingPerson;
    let id;
    let viewingOwnProfile;
    let isCreator;

    if (person) {
      viewingPerson = !!person;
      id = localStorage.getItem('id');
      viewingOwnProfile = (person.id === id);
    } else if (idea && me) {
      isMember = idea.members.map((member) => member.id).includes(me.id);
      isCreator = idea.creator === me.id;
      bookmarks = updatedBookmarks ? updatedBookmarks: me.bookmarked_ideas;
      isBookmarked = bookmarks.includes(idea.id) ? 'bookmark' : 'bookmark-border';
      viewingIdea = idea && me;
    }

    return (
      <div className="toolbar">
        { ((viewingIdea && !isMember && idea.contact)
            || (viewingPerson && !viewingOwnProfile))
          && <h3 className="toolbar-title">Start a Conversation</h3> }

        <div className="toolbar-tools">
          <div className="toolbar-contact">
            { (viewingIdea && !isMember && idea.contact) && (
              <div className="toolbar-item">
                <a href={`mailto:${idea.contact}?subject=New message for ${idea.title} via ORBIT!`}>
                  <Icon type="email-outline" />
                  <span>Contact</span>
                </a>
              </div>
            )}
            { (viewingPerson && !viewingOwnProfile) && (
              <div className="toolbar-item">
                <a href={`mailto:${person.email}?subject=New direct message via ORBIT!`}>
                  <Icon type="email-outline" />
                  <span>Contact</span>
                </a>
              </div>
            )}
          </div>

          <ul className="toolbar-list">
            {viewingIdea && (
              <li>
                <div className="toolbar-item">
                  <button type="button" onClick={this.toggleBookmark}>
                    <Icon type={isBookmarked} />
                    <span>{idea.bookmarked_count + bookmarkCountDelta}</span>
                  </button>
                </div>
              </li>
            )}

            { viewingIdea && isMember && (
              <li>
                <div className="toolbar-item">
                  <Link to={`/ideas/${idea.id}/edit`}>
                    <Icon type="create" />
                    <span>Edit</span>
                  </Link>
                </div>
              </li>
            )}
            { viewingOwnProfile && (
              <li>
                <div className="toolbar-item">
                  <Link to="/people/me/edit">
                    <Icon type="create" />
                    <span>Edit</span>
                  </Link>
                </div>
              </li>
            )}
            <li>
              <div className="toolbar-item dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => this.toggleDropdown('moreMenu')}
                >
                  <Icon type="more-vertical" />
                </button>
              </div>
              { moreMenu && (
                <Fragment>
                  <div
                    className="dropdown-tint"
                    onClick={() => this.toggleDropdown('moreMenu')}
                  />
                  <ul className="dropdown-menu">
                    <li>
                      <div className="toolbar-item">
                        <button
                          type="button"
                          onClick={() => {
                            this.toggleDropdown('moreMenu');
                            this.openModal('modalReport');
                          }}
                        >
                          <Icon type="flag-outline" />
                          <span>Report</span>
                        </button>
                      </div>
                    </li>
                    { isMember && !isCreator && (
                      <li>
                        <div
                          className="toolbar-item"
                          onClick={leaveIdea}
                        >
                          <button
                            type="button"
                            onClick={() => this.toggleDropdown('moreMenu')}
                          >
                            <Icon type="clear" />
                            <span>Leave Idea</span>
                          </button>
                        </div>
                      </li>
                    )}

                  </ul>
                </Fragment>
              )}
            </li>
          </ul>
        </div>

        <ModalReport
          reported={viewingPerson ? person.id : idea.id}
          reportedBy={viewingPerson ? id : me.id}
          type={viewingPerson ? 'User' : 'Idea'}
          visibility={modalReport}
          close={this.closeModal}
        />
      </div>
    );
  }
}

export default Toolbar;
