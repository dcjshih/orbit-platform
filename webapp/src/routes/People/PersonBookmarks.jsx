import React, { Fragment, Component } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CardIdea from '../../components/CardIdea';

import './PersonBookmarks.sass';

class PersonBookmarks extends Component {
  constructor() {
    super();
    this.state = {
      bookmarks: [],
      count: 0,
    };

    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    axios
      .get(`${API_URL}/users/me/bookmarks`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({
          bookmarks: response.data,
          count: response.data.length,
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
    const elements = [];
    const { bookmarks, count } = this.state;

    if (bookmarks) {
      bookmarks.forEach((bookmark) => {
        elements.push(
          <CardIdea
            key={bookmark.id}
            idea={bookmark}
          />,
        );
      });
    }

    return (
      <Fragment>
        <Navbar />
        <section className="bookmarks wrapper">
          <header>
            <h1>My bookmarks</h1>
          </header>

          { (count > 0)
            && (
              <Fragment>
                <div className="card-count">{`You have bookmarked ${count} ${count === 1 ? 'idea' : 'ideas'}:`}</div>
                <div className="card-container">
                  { elements }
                </div>
              </Fragment>
            )}

          { count === 0 && <p>No ideas bookmarked yet.</p> }

        </section>
        <Footer />
      </Fragment>
    );
  }
}

export default PersonBookmarks;
