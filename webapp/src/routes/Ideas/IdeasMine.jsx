import React, { Fragment, Component } from 'react';
import axios from 'axios';
import CardIdea from '../../components/CardIdea';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import './IdeasMine.sass';

class IdeasMine extends Component {
  constructor() {
    super();
    this.state = { ideas: [] };
    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    const endpoint = '/users/me/ideas';
    axios
      .get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({ ideas: response.data });
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
    const { ideas } = this.state;

    if (ideas) {
      ideas.forEach((idea) => {
        elements.push(
          <CardIdea
            key={idea.id}
            idea={idea}
          />,
        );
      });
    }

    return (
      <Fragment>
        <Navbar />
        <section className="ideas-mine wrapper">
          <header>
            <h1>My ideas</h1>
          </header>

          <div className="card-container">
            { elements }
          </div>

        </section>
        <Footer />
      </Fragment>
    );
  }
}

export default IdeasMine;
