import React, { Fragment, Component } from 'react';
import axios from 'axios';
import qs from 'qs';

// Components
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import RadioGroup from '../../components/RadioGroup';
import CardIdea from '../../components/CardIdea';
import PaginationControl from '../../components/PaginationControl';
import Checkbox from '../../components/Checkbox';
import ModalWelcome from '../../components/ModalWelcome';
import Grid from '../../components/Grid';

// Styles
import './IdeaIndex.sass';

// Search performed as 'OR'.
const searchableFields = [
  'title',
  'description',
  'institution',
  'interests',
];

class IdeaIndex extends Component {
  constructor() {
    super();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const welcome = urlParams.has('welcome');

    this.state = {
      welcome,
      user: false,
      ideas: [],
      count: 12,
    };

    this.token = localStorage.getItem('token');
    this.searchTerm = '';
    this.start = 0;
    this.limit = 12;
    this.filterCollaboration = false;

    // Bindings
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

    params.set('_sort', this.sort);
    params.set('_start', this.start);
    params.set('_limit', this.limit);

    return params.toString();
  }

  getCount() {
    const endpoint = '/ideas/count';
    const parameters = this.getCountParams();

    axios
      .get(`${API_URL}${endpoint}?${parameters}`, {
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

  getSearchParams() {
    const params = new URLSearchParams();
    const query = this.searchTerm || '';

    params.append('term', query);
    if (this.filterCollaboration) params.append('collaboration', true);
    params.set('_start', this.start);
    params.set('_limit', this.limit);

    return params.toString();
  }

  getData() {
    const endpoint = '/ideas';
    const parameters = this.getSearchParams();

    axios
      .get(`${API_URL}${endpoint}?${parameters}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => {
        this.setState({ ideas: response.data });
      })
      .catch((error) => {
        console.error('An error occurred: ', error);
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
    const {
      ideas,
      count,
      welcome,
    } = this.state;

    const elements = [];
    if (ideas) {
      ideas.forEach((idea) => {
        elements.push(
          <CardIdea
            key={idea._id}
            idea={idea}
            matches={idea.goals}
          />,
        );
      });
    }

    return (
      <Fragment>
        <Navbar />
        <main className="wrapper">
          <h1>Ideas</h1>
          <Grid>
            <p className="content-area">Explore collaboration opportunities! We recommend contacting idea creators via email to start a conversation before asking to join an idea. You can also create an idea of your own.</p>
          </Grid>

          <div className="people-filter">
            <SearchBar
              placeholder="Search for idea"
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
            <div className="people-count">{`Found ${count} ideas`}</div>
            <div className="people-container">
              { elements }
            </div>
          </section>

          <PaginationControl
            start={this.start}
            count={count}
            limit={this.limit}
            setStart={this.setStart}
          />

          { welcome && <ModalWelcome /> }
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default IdeaIndex;
