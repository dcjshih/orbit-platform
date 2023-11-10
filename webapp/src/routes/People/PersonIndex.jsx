import React, { Fragment, Component } from 'react';
import axios from 'axios';
import qs from 'qs';

// Components
import Navbar from '../../components/Navbar';
import CardPerson from '../../components/CardPerson';
import SearchBar from '../../components/SearchBar';
import PaginationControl from '../../components/PaginationControl';
import Footer from '../../components/Footer';
import Checkbox from '../../components/Checkbox';
import Grid from '../../components/Grid';

// Styles
import './PersonIndex.sass';

// Search performed as 'OR'.
const searchableFields = [
  'name',
  'bio',
  'institution',
  'position',
  'discipline_1',
  'discipline_2',
  'interests',
];

class PersonIndex extends Component {
  constructor() {
    super();
    this.state = {
      user: false,
      people: [],
      count: 12,
    };

    this.token = localStorage.getItem('token');
    this.searchTerm = '';
    this.start = 0;
    this.limit = 12; // Number of results per page
    this.filterCollaboration = false;

    // Context binding
    this.setStart = this.setStart.bind(this);
    this.changeSearchTerm = this.changeSearchTerm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.getUserData();
    this.getCount();
    this.getData();
  }

  getUserData() {
    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({ user: response.data });
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

  getCountParams() {
    const { user } = this.state;

    let query = '';
    if (this.searchTerm.length > 0) {
      const expressions = searchableFields.map((field) => (
        { [`${field}_contains`]: this.searchTerm }));

      query = qs.stringify({
        _where: {
          _or: expressions,
        },
      });
    }
    const params = new URLSearchParams(query);

    if (this.filterCollaboration) {
      params.append('collaboration_in', user.collaboration);
    }

    params.set('_start', this.start);
    params.set('_limit', this.limit);

    return params.toString();
  }


  getSearchParams() {
    const params = new URLSearchParams();

    const query = this.searchTerm || '';
    params.append('term', query);

    if (this.filterCollaboration) params.append('collaboration', true);

    params.set('_start', this.start);
    params.set('_limit', this.limit);
    return params.toString();
  }

  getCount() {
    const endpoint = '/users/count';
    const params = this.getCountParams();

    axios
      .get(`${API_URL}${endpoint}?${params}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({ count: response.data });
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

  getData() {
    const endpoint = '/users';
    const params = this.getSearchParams();

    axios
      .get(`${API_URL}${endpoint}?${params}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({ people: response.data });
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

  setStart(start) {
    this.start = start;
    this.getData();
  }

  changeSearchTerm(term) {
    this.searchTerm = term;
    this.getData();
    this.getCount();
  }

  handleInputChange(event) {
    const { target } = event;

    if (target.name === 'filterCollaboration') {
      this.filterCollaboration = !this.filterCollaboration;
    }

    // Get data based on new query string
    this.getData();
    this.getCount();
  }

  render() {
    const { people, count } = this.state;

    return (
      <Fragment>
        <Navbar />
        <main className="wrapper">
          <h1>People</h1>
          <Grid>
            <p className="content-area">Explore profiles to find and email potential collaborators. Connect based on one of your ideas, or come up with a new one together. Challenge yourself to connect with people outside of your discipline or areas of expertise—the purpose of ORBIT is to find collaborators outside of your usual networks.</p>
          </Grid>

          <div className="people-filter">
            <SearchBar
              placeholder="Search for name"
              value={this.searchTerm}
              onChange={this.changeSearchTerm}
            />
            <div className="parameters">
              <div className="filters">
                <span className="parameter-label">Filter by:</span>
                <Checkbox
                  name="filterCollaboration"
                  label="Collaboration type"
                  checked={this.filterCollaboration}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>

          <section className="people">
            <div className="people-count">{`Found ${count} people`}</div>
            <div className="people-container">
              { people.map((person) => (
                <CardPerson key={person._id} person={person} />
              ))}
            </div>
          </section>

          <PaginationControl
            start={this.start}
            count={count}
            limit={this.limit}
            setStart={this.setStart}
          />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default PersonIndex;
